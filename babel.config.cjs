/** @type {import('@babel/core').TransformOptions} */
module.exports = {
	presets: ['module:react-native-builder-bob/babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./src/'],
				extensions: ['.js', '.ios.js', '.android.js', '.ts', '.tsx'],
				alias: {
					_assets: './src/assets',
					_components: './src/components',
					_hooks: './src/hooks',
					_styles: './src/styles',
					_types: './src/types',
					_utils: './src/utils',
				},
			},
		],
		[
			'react-native-reanimated/plugin', // NOTE: Reanimated plugin has to be listed last.
		],
	],
};

// babel.config.cjs
// exported in cjs format because `type: module` is set in package.json
