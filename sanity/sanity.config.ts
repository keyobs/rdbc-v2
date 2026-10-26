import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
	name: "default",
	title: "rdbc-v2",

	projectId: "y8v3re1a",
	dataset: "production",

	plugins: [structureTool(), visionTool()],

	schema: {
		types: schemaTypes,
	},
});
