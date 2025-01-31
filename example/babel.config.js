const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');
const root = require('node:path').resolve(__dirname, '..');
module.exports = api => {
	api.cache(true);

	return getConfig(
		{
			presets: ['babel-preset-expo'],
			plugins: ['react-native-reanimated/plugin'],
		},
		{ root, pkg },
	);
};
