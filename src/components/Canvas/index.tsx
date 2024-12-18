import {
	Canvas,
	type Color,
	Image,
	Path,
	type SkImage,
	useCanvasRef,
} from '@shopify/react-native-skia';
import { useCanvasControls, usePanGesture } from '../../hooks';
import { globalStyles } from '../../styles/GlobalStyles';
import type { CanvasControls, PathData } from '../../types';
import { forwardRef, useMemo, useRef } from 'react';
import { useWindowDimensions, type ColorValue } from 'react-native';
import {
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';

type CanvasComponentProps = {
	backgroundImage?: SkImage | null;
	/**
	 * Background color of the canvas (if no background image is provided)
	 * @default #1B1B1B
	 */
	canvasColor?: ColorValue;
	/**
	 * Mode of the canvas
	 * @default 'highlighter'
	 */
	mode?: 'cubic' | 'quadratic';
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
};

const CanvasComponent = forwardRef<CanvasControls, CanvasComponentProps>(
	(
		{
			backgroundImage,
			canvasColor = '#1B1B1B',
			mode = 'cubic',
			strokeWeight = 8,
			toolColor = '#F8F8FF',
		},
		ref,
	) => {
		const windowDimensions = useWindowDimensions();

		const canvasRef = useCanvasRef();
		const pathStack = useRef<Array<PathData>>([]);
		const currentPath = useRef<PathData | null>(null);

		useCanvasControls(canvasRef, pathStack, ref);

		const panGesture = usePanGesture({
			currentPath,
			pathStack,
			strokeWeight,
			toolColor,
			mode,
		});

		const backgroundImageHeight = useMemo(
			() => backgroundImage?.height() ?? 0,
			[backgroundImage],
		);

		const backgroundImageWidth = useMemo(
			() => backgroundImage?.width() ?? 0,
			[backgroundImage],
		);

		return (
			<GestureHandlerRootView style={globalStyles.flex}>
				<GestureDetector gesture={panGesture}>
					<Canvas
						ref={canvasRef}
						style={[
							// If the background image is provided, set the canvas size to the background image size in order to avoid layout issues
							backgroundImageHeight > 0 &&
							backgroundImageWidth > 0
								? {
										width: backgroundImageWidth,
										height: backgroundImageHeight,
									}
								: globalStyles.flex,
							{ backgroundColor: canvasColor },
						]}>
						{backgroundImage ? (
							<Image
								fit={'contain'}
								height={windowDimensions.height}
								image={backgroundImage}
								width={windowDimensions.width}
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
