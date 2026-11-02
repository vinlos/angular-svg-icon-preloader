import angular from 'angular-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores(['projects/**/*']),
	{
		files: ['**/*.ts'],
		extends: [
			...tseslint.configs.recommended,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,

		rules: {
			'@angular-eslint/component-selector': [
				'error',
				{
					prefix: 'angular-svg-icon-preloader',
					style: 'kebab-case',
					type: 'element',
				},
			],

			'@angular-eslint/directive-selector': [
				'error',
				{
					prefix: 'angular-svg-icon-preloader',
					style: 'camelCase',
					type: 'attribute',
				},
			],
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended],
		rules: {
			'@angular-eslint/template/prefer-self-closing-tags': ['error'],
		},
	},
]);
