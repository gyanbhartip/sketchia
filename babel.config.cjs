/** @type {import('@babel/core').TransformOptions} */
module.exports = {
	presets: ['module:react-native-builder-bob/babel-preset'],
	plugins: [
		[
			'react-native-reanimated/plugin', // NOTE: Reanimated plugin has to be listed last.
		],
	],
};

// babel.config.cjs
// exported in cjs format because `type: module` is set in package.json
