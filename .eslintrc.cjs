module.exports = {
	root: true,
	extends: ['@react-native', 'prettier'],
	plugins: ['prettier', '@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			extends: [
				'plugin:@typescript-eslint/strict-type-checked',
				'plugin:@typescript-eslint/stylistic-type-checked',
			],
			rules: {
				'@typescript-eslint/no-shadow': ['error'],
			},
		},
		{
			files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
			extends: ['plugin:@typescript-eslint/disable-type-checked'],
		},
	],
	ignorePatterns: ['node_modules', 'dist', 'lib'],
	rules: {
		'react/no-did-mount-set-state': 2,
		'react/no-direct-mutation-state': 2,
		'react/jsx-uses-vars': 2,
		'semi': 2,
		'react/prop-types': 2,
		'react/jsx-no-bind': 2,
		'react-hooks/exhaustive-deps': 'warn',
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/array-type': ['error', { default: 'generic' }],
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
	},
};
