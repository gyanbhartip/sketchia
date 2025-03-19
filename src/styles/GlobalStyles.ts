import { StyleSheet, type ViewStyle } from 'react-native';

export const globalStyles = StyleSheet.create<GlobalStyles>({
	flex: {
		flex: 1,
	},
});

type GlobalStyles = {
	flex: ViewStyle;
};
