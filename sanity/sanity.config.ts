import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { SINGLETON_TYPES, structure } from "./structure";

// Singletons can only be edited, published or reverted
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
	name: "default",
	title: "rdbc-v2",

	projectId: "y8v3re1a",
	dataset: "production",

	plugins: [structureTool({ structure }), visionTool()],

	schema: {
		types: schemaTypes,
		// Singletons are opened from the structure, never created from a "+" menu
		templates: (templates) =>
			templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
	},

	document: {
		actions: (actions, { schemaType }) =>
			SINGLETON_TYPES.has(schemaType)
				? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
				: actions,
	},
});
