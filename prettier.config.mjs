// prettier.config.mjs
/**
 * define and export prettier config in mjs format because `type: module` is set in package.json
 */
const config = {
	arrowParens: 'avoid',
	bracketSameLine: true,
	bracketSpacing: true,
	endOfLine: 'auto',
	singleQuote: true,
	trailingComma: 'all',
	tabWidth: 4,
	printWidth: 80,
	quoteProps: 'consistent',
	useTabs: true,
};

export default config;
