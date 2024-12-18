import { SafeAreaView, StatusBar } from 'react-native';
import { HighlighterScreen, SignatureScreen } from 'sketchia';
import { globalStyles } from '../../src/styles/GlobalStyles';
import Permissions from './components/Permissions';

const App = () => {
	return (
		<SafeAreaView style={globalStyles.flex}>
			<Permissions />
			<StatusBar animated={true} barStyle={'dark-content'} />
			<HighlighterScreen />
			<SignatureScreen />
		</SafeAreaView>
	);
};

export default App;
