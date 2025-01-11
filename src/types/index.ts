import type {
	Color,
	ImageFormat,
	SkPath,
	SkRect,
} from '@shopify/react-native-skia';

export type Point = { x: number; y: number };

export type PathData = {
	color: Color;
	path: SkPath;
	strokeWidth: number;
};

export type SkiaDrawSnapshot = {
	/**
	 * Data URL containing metadata and base64 data. Can be used with React Native's Image component
	 */
	uri: string;
	/**
	 * Raw base64 data. Suitable for storing the image
	 */
	data: string;
	/**
	 * Height of the image in pixels
	 */
	height: number;
	/**
	 * Width of the image in pixels
	 */
	width: number;
};

/**
 * Options object for configuring how the {@linkcode makeImageSnapshot} method takes and encodes the current canvas state.
 */
export type ImageSnapshotConfig = {
	/**
	 * The rectangle to capture. If omitted, the entire canvas will be captured.
	 */
	rect?: SkRect;
	/**
	 * The format to encode the image in. Defaults to PNG.
	 */
	imageFormat?: ImageFormat;
	/**
	 * A value from 0 to 100. 100 is the least lossy. May be ignored.
	 */
	quality?: number;
};

export type CanvasControls = {
	clear: () => void;
	isEmpty: () => boolean;
	makeImageSnapshot: (
		config?: ImageSnapshotConfig,
	) => SkiaDrawSnapshot | undefined;
	undo: () => void;
};
