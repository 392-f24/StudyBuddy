// npm install --save-dev eslint prettier @babel/eslint-parser @babel/plugin-syntax-jsx eslint-config-prettier eslint-plugin-import eslint-plugin-prettier eslint-plugin-react
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ["node_modules/", "build/"],
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        React: "readonly",
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          plugins: ["@babel/plugin-syntax-jsx"],
        },
      },
    },
    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "import/order": [
        "error",
        {
          "groups": [["builtin", "external", "internal"]],
          "pathGroups": [
            {
              "pattern": "react",
              "group": "builtin",
              "position": "before"
            }
          ],
          "pathGroupsExcludedImportTypes": ["react"],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }
      ],
      "max-len": [
        "error",
        {
          "code": 80,
          "ignoreUrls": true,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true,
          "ignoreRegExpLiterals": true
        }
      ]
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
