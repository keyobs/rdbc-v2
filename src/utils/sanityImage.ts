import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "@sanity/client";

const client = createClient({
	projectId: "y8v3re1a",
	dataset: "production",
	apiVersion: "2024-01-01",
	useCdn: true,
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source: Parameters<typeof builder.image>[0]) =>
	builder.image(source);
