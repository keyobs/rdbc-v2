import type { SanityClient } from "sanity";
import type { JoinPage } from "../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
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
		client.fetch<JoinRoleData[]>('*[_type == "joinRole"]'),
	]);
	return resolveJoinContent(page, roles, locale);
}
