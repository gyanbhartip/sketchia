import {
	Canvas,
	type Color,
	Image,
	Path,
	type SkImage,
	useCanvasRef,
} from '@shopify/react-native-skia';
import { forwardRef, useCallback, useRef, useState } from 'react';
import type {
	ColorValue,
	LayoutChangeEvent,
	LayoutRectangle,
} from 'react-native';
import {
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useCanvasControls, usePanGesture } from '../../hooks';
import { globalStyles } from '../../styles';
import type { CanvasControls, PathData } from '../../types';

type CanvasComponentProps = {
	backgroundImage?: SkImage | null;
	/**
	 * Background color of the canvas (if no background image is provided)
	 * @default #1B1B1B
	 */
	canvasColor?: ColorValue;
	/**
	 * Mode of the canvas
	 * @default 'cubic'
	 */
	mode?: 'cubic' | 'quadratic';
	/**
	 * Handler function to be called when the stroke starts
	 */
	onStrokeStart?: () => void;
	/**
	 * Handler function to be called when the stroke ends
	 */
	onStrokeEnd?: () => void;
	/**
	 * Weight of the stroke
	 * @default 8
	 */
	strokeWeight?: number;
	/**
	 * Color of the stroke
	 * @default #F8F8FF
	 */
	toolColor?: Color;
	/**
	 * Whether the canvas should enabled for drawing
	 * @default true
	 */
	touchEnabled?: boolean;
};

const CanvasComponent = forwardRef<CanvasControls, CanvasComponentProps>(
	(
		{
			backgroundImage = null,
			canvasColor = '#1B1B1B',
			mode = 'cubic',
			onStrokeEnd,
			onStrokeStart,
			strokeWeight = 8,
			toolColor = '#F8F8FF',
			touchEnabled,
		},
		ref,
	) => {
		const canvasRef = useCanvasRef();
		const pathStack = useRef<Array<PathData>>([]);
		const currentPath = useRef<PathData | null>(null);

		useCanvasControls(canvasRef, pathStack, ref, backgroundImage);

		const panGesture = usePanGesture({
			currentPath,
			mode,
			onStrokeEnd,
			onStrokeStart,
			pathStack,
			strokeWeight,
			toolColor,
			touchEnabled,
		});

		const [canvasSize, setCanvasSize] = useState<LayoutRectangle>({
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		});

		const updateCanvasSize = useCallback((event: LayoutChangeEvent) => {
			setCanvasSize(event.nativeEvent.layout);
		}, []);

		return (
			<GestureHandlerRootView
				onLayout={updateCanvasSize}
				style={globalStyles.flex}>
				<GestureDetector gesture={panGesture}>
					<Canvas
						ref={canvasRef}
						style={{
							backgroundColor: canvasColor,
							height: canvasSize.height,
							width: canvasSize.width,
						}}>
						{backgroundImage ? (
							<Image
								fit={'contain'}
								height={canvasSize.height}
								image={backgroundImage}
								width={canvasSize.width}
								x={0}
								y={0}
							/>
						) : null}
						{/* First render all completed paths from the stack */}
						{pathStack.current.map((pathData, index) => (
							<Path
								key={`stack-${index.toString()}`}
								path={pathData.path}
								color={pathData.color}
								style="stroke"
								strokeWidth={pathData.strokeWidth}
								strokeCap="round"
								strokeJoin="round"
								antiAlias
							/>
						))}
						{/* Then render the current path if it exists */}
						{currentPath.current && (
							<Path
								path={currentPath.current.path}
								color={currentPath.current.color}
								style="stroke"
								strokeWidth={currentPath.current.strokeWidth}
								strokeCap="round"
								strokeJoin="round"
								antiAlias
							/>
						)}
					</Canvas>
				</GestureDetector>
			</GestureHandlerRootView>
		);
	},
);

export default CanvasComponent;
