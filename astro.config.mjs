// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { fileURLToPath } from "node:url";

export default defineConfig({
	integrations: [react()],
	vite: {
		resolve: {
			alias: {
				"@components": fileURLToPath(new URL("./src/components", import.meta.url)),
				"@features": fileURLToPath(new URL("./src/features", import.meta.url)),
				"@i18n": fileURLToPath(new URL("./src/i18n", import.meta.url)),
				"@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
				"@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
			},
		},
	},
});
