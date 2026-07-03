import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
    {
        files: ["**/*.ts", "**/*.tsx"],
        extends: [
            eslintJs.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            eslintReact.configs["recommended-type-checked"],
            eslintPluginBetterTailwindcss.configs.recommended,
            prettierConfig,
        ],

        settings: {
            "better-tailwindcss": {
                // Tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
                entryPoint: "./src/app/globals.css",
            },
        },

        plugins: {
            "simple-import-sort": simpleImportSort,
        },

        // Custom rule overrides (modify rule levels or disable rules)
        rules: {
            "simple-import-sort/exports": "error",
            "simple-import-sort/imports": "error",
        },

        // Configure language/parsing options
        languageOptions: {
            // Use TypeScript ESLint parser for TypeScript files
            parser: tseslint.parser,
            parserOptions: {
                // Enable project service for better TypeScript integration
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]);
