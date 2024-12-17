import { ImageFormat } from '@shopify/react-native-skia';
import type { Permission } from 'react-native';

export const ImageFormatMimeTypeMap: Record<ImageFormat, string> = {
	[ImageFormat.JPEG]: 'image/jpeg',
	[ImageFormat.PNG]: 'image/png',
	[ImageFormat.WEBP]: 'image/webp',
};

export const REQUIRED_PERMISSIONS = {
	READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES',
	READ_MEDIA_VIDEO: 'android.permission.READ_MEDIA_VIDEO',
	READ_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
	WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
} satisfies Record<string, Permission>;

export const createThrottle = (
	func: (...args: Array<unknown>) => void,
	limit: number,
) => {
	let inThrottle: boolean;
	let lastRan: number;
	let timeoutId: NodeJS.Timeout;

	return {
		throttledFunc: function (...args: Array<unknown>) {
			const now = Date.now();

			if (!inThrottle || now - lastRan >= limit) {
				func.apply(this, args);
				lastRan = now;
				inThrottle = true;
				timeoutId = setTimeout(() => {
					inThrottle = false;
				}, limit);
			}
		},
		cancel: () => {
			clearTimeout(timeoutId);
			inThrottle = false;
			lastRan = 0;
		},
	};
};
