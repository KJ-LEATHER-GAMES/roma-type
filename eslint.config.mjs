// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    // 無視
    { ignores: [
        'dist/',
        'node_modules/',
        'src-tauri/target/',
        'src-tauri/gen/'] },

    // JSの基本推奨
    js.configs.recommended,

    // ★ 型付きTypeScriptルール：src配下だけに限定
    ...tseslint.configs.recommendedTypeChecked.map((c) => ({
        ...c,
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            ...c.languageOptions,
            parserOptions: {
                ...c.languageOptions?.parserOptions,
                project: ['./tsconfig.app.json', './tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    })),

    // ★ 設定系TSファイルは「型なしLint」に切り分け（parserOptions.projectを無効化）
    ...tseslint.configs.recommended.map((c) => ({
        ...c,
        files: ['vite.config.ts', 'vitest.config.ts', '*.config.{ts,cts,mts}'],
        languageOptions: {
            ...c.languageOptions,
            parserOptions: {
                ...c.languageOptions?.parserOptions,
                project: null, // これでtyped lintを無効化
            },
        },
    })),

    // 共通の追加ルール（TS/TSXに適用）
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
            'unused-imports': unusedImports,
        },
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'unused-imports/no-unused-imports': 'error',
            'import/order': [
                'warn',
                { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
            ],
            ...reactHooks.configs.recommended.rules,
            'jsx-a11y/anchor-is-valid': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },

    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        settings: {
            "import/resolver": {
                typescript: {
                // VSCode や CLI の ESLint が参照すべき tsconfig を列挙
                    project: ["./tsconfig.json"]
                },
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"]
                }
            }
        }
    },

    {
        files: ["**/*.test.{ts,tsx}"],
        rules: {
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
        },
        languageOptions: {
            globals: {
                describe: "readonly",
                test: "readonly",
                it: "readonly",
                expect: "readonly",
            },
        },
    },
];
