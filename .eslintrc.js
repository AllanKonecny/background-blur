module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		project: 'tsconfig.json'
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/@typescript-eslint'
	],
	env: {
		browser: false,
		es2020: true
	},
	rules: {
		'no-var': 'error',
		'no-console': [
			'error',
			{
				allow: ['warn', 'error']
			}
		],
		'import/no-unresolved': 'off',
		'import/named': 'off',
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'no-shadow': 'off',
		'no-useless-constructor': 'off',
		'@typescript-eslint/no-useless-constructor': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/unbound-method': 'warn',
		'@typescript-eslint/no-empty-function': 'error'
	}
};
