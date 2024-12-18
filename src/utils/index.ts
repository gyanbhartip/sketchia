import { ImageFormat } from '@shopify/react-native-skia';
import type { Point } from '_types';
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

/**
 * This point decimation logic is used to simplify a path by removing points that are too close together
 * Uses Ramer-Douglas-Peucker algorithm with distance-based filtering
 * @param points Array of points to simplify
 * @param tolerance Minimum distance between points (in pixels)
 */
export const simplifyPath = (
	points: Array<Point>,
	tolerance = 2,
): Array<Point> => {
	if (points.length <= 2) {
		return points;
	}

	const results = points[0] ? ([points[0]] satisfies Array<Point>) : [];
	let lastPoint = points[0];

	for (let i = 1; i < points.length; i++) {
		const point = points[i];
		if (!point || !lastPoint) {
			continue;
		}
		const distance = Math.hypot(
			point.x - lastPoint.x,
			point.y - lastPoint.y,
		);

		// Keep point if:
		// 1. Distance exceeds tolerance
		// 2. It's the last point (to maintain path end)
		// 3. There's a significant direction change
		if (
			distance >= tolerance ||
			i === points.length - 1 ||
			(i < points.length - 1 &&
				isSignificantDirectionChange(lastPoint, point, points[i + 1]))
		) {
			results.push(point);
			lastPoint = point;
		}
	}

	return results;
};

/**
 * Checks if there's a significant direction change at a point
 * This helps preserve important curve characteristics
 */
export const isSignificantDirectionChange = (
	p1: Point,
	p2: Point,
	p3: Point | undefined,
): boolean => {
	if (!p3) {
		return false; // Return false if p3 is undefined since there's no direction change to evaluate
	}
	const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
	const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
	const angleDiff = Math.abs(angle2 - angle1);
	return angleDiff > Math.PI / 6; // 30 degrees threshold
};
