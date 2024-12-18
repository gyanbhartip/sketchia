import { useImage } from '@shopify/react-native-skia';
import { SketchiaCanvas } from 'sketchia';

// TODO: implement stroke weight and tool color
const HighlighterScreen = () => {
	const backgroundImage = useImage('https://picsum.photos/1000?blur=2');
	return (
		<SketchiaCanvas
			backgroundImage={backgroundImage}
			mode="quadratic"
			strokeWeight={8}
			toolColor="#F0E0B0"
		/>
	);
};

export default HighlighterScreen;
