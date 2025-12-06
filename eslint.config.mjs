import parser from '@angular-eslint/template-parser';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([
	globalIgnores(['projects/**/*']),
	{
		files: ['**/*.html'],
		extends: compat.extends('plugin:@angular-eslint/template/recommended'),

		languageOptions: {
			parser: parser,
			ecmaVersion: 5,
			sourceType: 'script',

			parserOptions: {
				project: './tsconfig.json',
			},
		},

		rules: {
			'@angular-eslint/template/prefer-self-closing-tags': ['error'],
		},
	},
	{
		files: ['**/*.ts'],

		extends: compat.extends(
			'plugin:@angular-eslint/recommended',
			'plugin:@angular-eslint/template/process-inline-templates',
		),

		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script',

			parserOptions: {
				project: ['tsconfig.json', 'e2e/tsconfig.json'],
				createDefaultProgram: true,
			},
		},

		rules: {
			'@angular-eslint/component-selector': [
				'error',
				{
					prefix: 'app',
					style: 'kebab-case',
					type: 'element',
				},
			],

			'@angular-eslint/directive-selector': [
				'error',
				{
					prefix: 'app',
					style: 'camelCase',
					type: 'attribute',
				},
			],
		},
	},
]);
