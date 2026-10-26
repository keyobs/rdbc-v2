// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { fileURLToPath } from "node:url";

const base = process.env.ASTRO_BASE_PATH ?? "/";

export default defineConfig({
	site: "https://keyobs.github.io",
	base,
	integrations: [
		react(),
		sanity({
			projectId: "y8v3re1a",
			dataset: "production",
			useCdn: false,
			apiVersion: "2024-01-01",
		}),
	],
	vite: {
		resolve: {
			alias: {
				"@components": fileURLToPath(
					new URL("./src/components", import.meta.url),
				),
				"@features": fileURLToPath(new URL("./src/features", import.meta.url)),
				"@i18n": fileURLToPath(new URL("./src/i18n", import.meta.url)),
				"@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
				"@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
				"@constants": fileURLToPath(
					new URL("./src/constants", import.meta.url),
				),
				"@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
				"@mockup": fileURLToPath(new URL("./src/mockup", import.meta.url)),
				"@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
			},
		},
	},
});
