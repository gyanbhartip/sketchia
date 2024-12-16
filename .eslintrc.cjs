module.exports = {
	root: true,
	extends: ['@react-native'],
	plugins: ['import'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			extends: [
				'plugin:@typescript-eslint/strict-type-checked',
				'plugin:@typescript-eslint/stylistic-type-checked',
			],
			parserOptions: {
				project: './tsconfig.json',
			},
			rules: {
				'@typescript-eslint/no-shadow': ['error'],
			},
		},
	],
	ignorePatterns: ['node_modules', 'dist', 'lib', 'example/babel.config.cjs'],
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
