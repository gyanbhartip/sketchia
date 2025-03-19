import type { SkPath } from '@shopify/react-native-skia';
import {
	type Color,
	ImageFormat,
	type SkImage,
	Skia,
	type useCanvasRef,
} from '@shopify/react-native-skia';
import {
	type ForwardedRef,
	type MutableRefObject,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useReducer,
	useRef,
} from 'react';
import { Gesture } from 'react-native-gesture-handler';
import type {
	CanvasControls,
	ImageSnapshotConfig,
	PathData,
	Point,
	SkiaDrawSnapshot,
} from '../types';
import { ImageFormatMimeTypeMap, createThrottle, simplifyPath } from '../utils';

/**
 * Custom hook to force a component re-render
 */
export const useRerender = () => {
	const [, dispatch] = useReducer((x: number) => x + 1, 0);

	return useCallback(() => {
		dispatch();
	}, []);
};

/**
 * Hook to provide canvas control methods like undo, clear and taking snapshots
 */
export const useCanvasControls = (
	canvasRef: ReturnType<typeof useCanvasRef>,
	pathStack: MutableRefObject<Array<PathData>>,
	ref: ForwardedRef<CanvasControls>,
	backgroundImage: SkImage | null,
) => {
	const rerender = useRerender();

	useImperativeHandle(ref, () => ({
		clear,
		isEmpty,
		makeImageSnapshot,
		undo,
	}));

	// Clear all paths from canvas
	const clear = () => {
		pathStack.current = [];
		rerender();
	};

	// Check if canvas is empty
	const isEmpty = () => {
		return pathStack.current.length === 0 && backgroundImage === null;
	};

	/**
	 * Creates a snapshot of the current canvas state
	 * @param config Optional configuration for the snapshot
	 * @returns Image data including URI and dimensions
	 */
	const makeImageSnapshot = (
		config?: ImageSnapshotConfig,
	): SkiaDrawSnapshot | undefined => {
		const skImage =
			canvasRef.current?.makeImageSnapshot(config?.rect) ?? undefined;
		if (skImage === undefined) {
			return undefined;
		}
		const imageFormat = config?.imageFormat ?? ImageFormat.PNG;
		const b64Data = skImage.encodeToBase64(
			imageFormat,
			config?.quality ?? 100,
		);
		const data = b64Data;
		const uri = `data:${ImageFormatMimeTypeMap[imageFormat]};base64,${b64Data}`;
		const height = skImage.height() / 2;
		const width = skImage.width() / 2;
		return {
			data,
			uri,
			height,
			width,
		};
	};

	// Remove the last drawn path
	const undo = () => {
		pathStack.current.pop();
		rerender();
	};
};

export const useHandlers = (canvasRef: React.RefObject<CanvasControls>) => {
	const handleSave = useCallback(
		(saveConfig?: ImageSnapshotConfig) => {
			return canvasRef.current?.makeImageSnapshot(saveConfig);
		},
		[canvasRef],
	);

	const handleClear = useCallback(() => {
		canvasRef.current?.clear();
	}, [canvasRef]);

	const handleUndo = useCallback(() => {
		canvasRef.current?.undo();
	}, [canvasRef]);

	return useMemo(
		() => ({ handleSave, handleClear, handleUndo }),
		[handleSave, handleClear, handleUndo],
	);
};

/**
 * Hook to handle pan gestures for drawing on canvas
 * Supports both signature and highlighter modes
 */
export const useGesture = ({
	currentPath,
	mode = 'cubic',
	onStrokeEnd,
	onStrokeStart,
	pathStack,
	strokeWeight,
	toolColor,
	touchEnabled = true,
}: {
	currentPath: MutableRefObject<PathData | null>;
	mode?: 'cubic' | 'quadratic';
	onStrokeEnd?: () => void;
	onStrokeStart?: () => void;
	pathStack: MutableRefObject<Array<PathData>>;
	strokeWeight: number;
	toolColor: Color;
	touchEnabled?: boolean;
}) => {
	// Refs to track animation frame, points and last drawn point
	const frameId = useRef<number>();
	const lastPoint = useRef<Point | null>(null);
	const points = useRef<Array<Point>>([]);
	const rerender = useRerender();

	// Throttle rerender calls to maintain 60fps
	const throttledRerender = useMemo(
		() =>
			createThrottle(() => {
				frameId.current = requestAnimationFrame(rerender);
			}, 1000 / 60),
		[rerender],
	);

	// Cleanup animation frame and throttle on unmount
	useEffect(() => {
		return () => {
			throttledRerender.cancel();
			if (frameId.current) {
				cancelAnimationFrame(frameId.current);
			}
		};
	}, [throttledRerender]);

	/**
	 * Creates a smooth signature path using Catmull-Rom spline interpolation
	 */
	const generateCubicBezierPath = useCallback(
		(pathPoints: Array<Point>): SkPath => {
			const path = Skia.Path.Make();
			if (pathPoints.length < 2) {
				return path;
			}

			if (pathPoints[0]) {
				path.moveTo(pathPoints[0].x, pathPoints[0].y);
			}

			if (pathPoints.length === 2) {
				// For just two points, draw a simple line
				if (pathPoints[1]) {
					path.lineTo(pathPoints[1].x, pathPoints[1].y);
				}
			} else {
				// Use Catmull-Rom spline with enhanced control points
				for (let i = 0; i < pathPoints.length - 1; i++) {
					const p0 = pathPoints[Math.max(0, i - 1)];
					const p1 = pathPoints[i];
					const p2 =
						pathPoints[Math.min(i + 1, pathPoints.length - 1)];
					const p3 =
						pathPoints[Math.min(i + 2, pathPoints.length - 1)];

					// Parameters to control curve characteristics
					const tension = 0.5; // Controls curve tightness
					const smoothing = 0.75; // Controls overall smoothness

					// Calculate control points for cubic Bézier curve
					if (p0 && p1 && p2 && p3) {
						// Calculate segment lengths for weighted control points
						const d1 = Math.sqrt(
							(p2.x - p0.x) ** 2 + (p2.y - p0.y) ** 2,
						);
						const d2 = Math.sqrt(
							(p3.x - p1.x) ** 2 + (p3.y - p1.y) ** 2,
						);

						// First control point
						const cp1x =
							p1.x +
							(p2.x - p0.x) *
								tension *
								smoothing *
								(d1 / (d1 + d2));
						const cp1y =
							p1.y +
							(p2.y - p0.y) *
								tension *
								smoothing *
								(d1 / (d1 + d2));

						// Second control point
						const cp2x =
							p2.x -
							(p3.x - p1.x) *
								tension *
								smoothing *
								(d2 / (d1 + d2));
						const cp2y =
							p2.y -
							(p3.y - p1.y) *
								tension *
								smoothing *
								(d2 / (d1 + d2));

						path.cubicTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
					}
				}
			}

			return path;
		},
		[],
	);

	/**
	 * Creates a highlighter path using quadratic Bézier curves
	 * for a more natural highlighting effect with light smoothing
	 */
	const generateQuadraticBezierPath = useCallback(
		(pathPoints: Array<Point>): SkPath => {
			const path = Skia.Path.Make();
			if (pathPoints.length < 2) {
				return path;
			}

			if (pathPoints[0]) {
				path.moveTo(pathPoints[0].x, pathPoints[0].y);
			}

			// Use quadratic curves with slightly offset control points for smoother curves
			for (let i = 1; i < pathPoints.length; i++) {
				const p0 = pathPoints[i - 1];
				const p1 = pathPoints[i];

				if (p0 && p1) {
					// Calculate distance between points for proportional smoothing
					const dist = Math.sqrt(
						(p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2,
					);
					const smoothing = Math.min(0.2, dist * 0.01); // Light adaptive smoothing

					// Offset control point slightly from midpoint for smoother curves
					const midX = (p0.x + p1.x) / 2;
					const midY = (p0.y + p1.y) / 2;
					const cpx = midX + (p1.x - p0.x) * smoothing;
					const cpy = midY + (p1.y - p0.y) * smoothing;

					path.quadTo(cpx, cpy, p1.x, p1.y);
				}
			}

			return path;
		},
		[],
	);

	const tapGesture = Gesture.Tap()
		.runOnJS(true)
		.enabled(touchEnabled)
		.onStart(() => {
			onStrokeStart?.();
		})
		.onEnd(({ x, y }) => {
			const path = Skia.Path.Make();
			path.moveTo(x, y);
			path.addCircle(x, y, strokeWeight / 2);
			pathStack.current = [
				...pathStack.current,
				{ path, color: toolColor, strokeWidth: strokeWeight },
			];
			onStrokeEnd?.();
			requestAnimationFrame(rerender);
		});

	const panGesture = Gesture.Pan()
		.runOnJS(true)
		.minDistance(1)
		.enabled(touchEnabled)
		.onStart(({ x, y }) => {
			// Initialize new path on gesture start
			const point = { x, y };
			points.current = [point];
			lastPoint.current = point;

			const newPath = Skia.Path.Make();
			newPath.moveTo(x, y);
			currentPath.current = {
				path: newPath,
				color: toolColor,
				strokeWidth: strokeWeight,
			};

			onStrokeStart?.();

			requestAnimationFrame(rerender);
		})
		.onChange(({ x, y }) => {
			if (!currentPath.current) {
				return;
			}

			const newPoint = { x, y };

			points.current.push(newPoint);

			// Only update path with simplified points during drawing
			const simplifiedPoints = simplifyPath(points.current);

			// Update path based on selected mode
			currentPath.current.path =
				mode === 'cubic'
					? generateCubicBezierPath(simplifiedPoints)
					: generateQuadraticBezierPath(simplifiedPoints);

			throttledRerender.throttledFunc();
		})
		.onEnd(() => {
			if (!currentPath.current) {
				return;
			}

			// Use full point set for final path, but still apply simplification
			const finalPoints = simplifyPath(points.current, 1); // Lower tolerance for final path

			// Finalize path and add to stack
			const finalPath =
				mode === 'cubic'
					? generateCubicBezierPath(finalPoints)
					: generateQuadraticBezierPath(finalPoints);

			pathStack.current = [
				...pathStack.current,
				{
					path: finalPath,
					color: currentPath.current.color,
					strokeWidth: currentPath.current.strokeWidth,
				},
			];

			// Reset current path state
			currentPath.current = null;
			points.current = [];
			lastPoint.current = null;

			onStrokeEnd?.();

			requestAnimationFrame(rerender);
		});

	return useMemo(
		() => Gesture.Race(tapGesture, panGesture),
		[tapGesture, panGesture],
	);
};
