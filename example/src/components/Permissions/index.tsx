import { REQUIRED_PERMISSIONS } from 'sketchia';
import { useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const PermissionsComponent = () => {
	const hasAndroidPermission = useCallback(async () => {
		const getCheckPermissionPromise = async () => {
			if (Platform.Version.toString() >= '33') {
				const [
					hasReadMediaImagesPermission,
					hasReadMediaVideoPermission,
				] = await Promise.all([
					PermissionsAndroid.check(
						REQUIRED_PERMISSIONS.READ_MEDIA_IMAGES,
					),
					PermissionsAndroid.check(
						REQUIRED_PERMISSIONS.READ_MEDIA_VIDEO,
					),
				]);
				return (
					hasReadMediaImagesPermission && hasReadMediaVideoPermission
				);
			}
			return PermissionsAndroid.check(
				REQUIRED_PERMISSIONS.READ_EXTERNAL_STORAGE,
			);
		};

		const _hasPermission = await getCheckPermissionPromise();
		if (_hasPermission) {
			return true;
		}
		const getRequestPermissionPromise = async () => {
			if (Platform.Version.toString() >= '33') {
				const statuses = await PermissionsAndroid.requestMultiple([
					REQUIRED_PERMISSIONS.READ_MEDIA_IMAGES,
					REQUIRED_PERMISSIONS.READ_MEDIA_VIDEO,
				]);
				return (
					statuses[REQUIRED_PERMISSIONS.READ_MEDIA_IMAGES] ===
						PermissionsAndroid.RESULTS.GRANTED &&
					statuses[REQUIRED_PERMISSIONS.READ_MEDIA_VIDEO] ===
						PermissionsAndroid.RESULTS.GRANTED
				);
			}
			const status = await PermissionsAndroid.request(
				REQUIRED_PERMISSIONS.READ_EXTERNAL_STORAGE,
			);
			return status === PermissionsAndroid.RESULTS.GRANTED;
		};
		return await getRequestPermissionPromise();
	}, []);

	useEffect(() => {
		hasAndroidPermission()
			.then(console.log)
			.catch((error: unknown) => {
				console.error(error);
			});
	}, [hasAndroidPermission]);

	return null;
};

export default PermissionsComponent;
