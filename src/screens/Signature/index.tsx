import { Canvas } from '@shopify/react-native-skia';
import type { CanvasControls } from '_types';
import { useCallback, useRef } from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { ClearIcon, SaveIcon, UndoIcon } from '../../assets/Icons';
import CanvasComponent from '../../components/Canvas';
import { useHandlers } from '../../hooks';
import { globalStyles } from '../../styles/GlobalStyles';

const SignatureScreen = ({
	canvasColor = '#1B1B1B',
	strokeColor = '#F0E0B0',
	strokeWeight = 2,
}: {
	canvasColor?: string;
	strokeColor?: string;
	strokeWeight?: number;
}) => {
	const canvasRef = useRef<CanvasControls>(null);

	const { handleSave, handleClear, handleUndo } = useHandlers(canvasRef);

	const saveHandler = useCallback(() => {
		const image = handleSave();
		console.log('🚀 ~ saveHandler ~ image:', image);
	}, [handleSave]);

	return (
		<SafeAreaView style={globalStyles.flex}>
			<CanvasComponent
				canvasColor={canvasColor}
				mode="cubic"
				ref={canvasRef}
				strokeWeight={strokeWeight}
				toolColor={strokeColor}
			/>

			<View style={styles.buttonsContainer}>
				<Pressable onPress={handleClear}>
					<Canvas style={[styles.button]}>
						<ClearIcon />
					</Canvas>
				</Pressable>

				<Pressable onPress={handleUndo}>
					<Canvas style={[styles.button]}>
						<UndoIcon />
					</Canvas>
				</Pressable>

				<Pressable onPress={saveHandler}>
					<Canvas style={[styles.button]}>
						<SaveIcon />
					</Canvas>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

export default SignatureScreen;

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20,
		height: 32,
		width: 32,
	},
	buttonsContainer: {
		alignItems: 'center',
		backgroundColor: '#1B1B1B',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
});
