import type { SanityClient } from "sanity";
import type { JoinPage } from "../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import { urlFor } from "@utils/sanityImage";
import {
	resolveJoinContent,
	type JoinContent,
	type JoinRoleData,
} from "./joinContent";

export async function getJoinContent(
	client: SanityClient,
	locale: Locale,
): Promise<JoinContent> {
	const [page, roles] = await Promise.all([
		client.fetch<JoinPage | null>('*[_id == "joinPage"][0]'),
		client.fetch<JoinRoleData[]>(
			`*[_type == "joinRole"]{
				...,
				"videoUrl": select(defined(videoRef) => videoRef->file.asset->url, video.asset->url),
				"poster": select(
					defined(posterRef->image.asset) => posterRef->image,
					defined(poster.asset) => poster,
					defined(videoRef->thumbnailRef->image.asset) => videoRef->thumbnailRef->image,
					videoRef->thumbnail
				)
			}`,
		),
	]);
	return resolveJoinContent(
		page,
		roles.map((role) => ({
			...role,
			posterUrl: role.poster?.asset
				? urlFor(role.poster)
						.width(800)
						.height(800)
						.fit("crop")
						.auto("format")
						.url()
				: undefined,
		})),
		locale,
	);
}
