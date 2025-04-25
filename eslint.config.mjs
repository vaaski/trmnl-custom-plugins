import globals from "globals"
import pluginJs from "@eslint/js"
import tsEslint from "typescript-eslint"
import unicorn from "eslint-plugin-unicorn"

export default tsEslint.config(
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{ ignores: ["dist/**/*"] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tsEslint.configs.recommended,
	unicorn.configs["flat/recommended"],
	{
		rules: {
			"unicorn/prefer-ternary": "off",
		},
	},
)
