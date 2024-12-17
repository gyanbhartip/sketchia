import { useImage } from '@shopify/react-native-skia';
import { SafeAreaView, StatusBar } from 'react-native';
import { SketchiaCanvas } from 'sketchia';
import { globalStyles } from '../../src/styles/GlobalStyles';
import Permissions from './components/Permissions';

const App = () => {
	const backgroundImage = useImage('https://picsum.photos/1000?blur=2');

	return (
		<SafeAreaView style={globalStyles.flex}>
			<Permissions />
			<StatusBar animated={true} barStyle={'dark-content'} />
			<SketchiaCanvas
				backgroundImage={backgroundImage}
				mode="highlighter"
				strokeWeight={6}
				toolColor="#F0E0B0"
			/>
		</SafeAreaView>
	);
};

export default App;
