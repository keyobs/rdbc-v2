import type { JoinPage, JoinRole } from "../../../sanity/sanity.types";
import { JOIN_ROLES, type JoinRoleId } from "../../../sanity/joinRoles.ts";
import fr from "../../i18n/fr.ts";
import en from "../../i18n/en.ts";
import type { Locale } from "../../i18n/index";

export type { JoinRoleId } from "../../../sanity/joinRoles.ts";

export interface JoinProfile {
	id: JoinRoleId;
	anchor: string;
	title: string;
	lead: string;
	text: string;
	tags: string[];
	cta: string;
	message: string;
	video?: { src: string; poster?: string };
	poster?: string;
}

export interface JoinContent {
	hero: { eyebrow: string; title: string; text: string };
	values: { title: string; text: string; tags: string[] };
	roles: JoinProfile[];
}

export type JoinRoleData = Partial<JoinRole> &
	Pick<JoinRole, "_id"> & {
		videoUrl?: string | null;
		posterUrl?: string | null;
	};

export function resolveJoinContent(
	page: Partial<JoinPage> | null,
	profiles: JoinRoleData[],
	locale: Locale,
): JoinContent {
	const defaults = (locale === "en" ? en : fr).join;
	const text = (
		value: { fr?: string; en?: string } | undefined,
		fallback: string,
	): string => value?.[locale]?.trim() || value?.fr?.trim() || fallback;
	const tags = (
		value: { fr?: string[]; en?: string[] } | undefined,
		fallback: string[],
	): string[] => [
		...new Set(
			(value?.[locale] ?? value?.fr ?? fallback)
				.map((tag) => tag.trim())
				.filter(Boolean),
		),
	];

	return {
		hero: {
			eyebrow: text(page?.eyebrow, defaults.hero.eyebrow),
			title: text(page?.title, defaults.hero.title),
			text: text(page?.introduction, defaults.hero.text),
		},
		values: {
			title: text(page?.valuesTitle, defaults.values.title),
			text: text(page?.valuesText, defaults.values.text),
			tags: tags(page?.valuesTags, [
				defaults.values.antiracist,
				defaults.values.feminist,
				defaults.values.lgbt,
				defaults.values.beliefs,
			]),
		},
		roles: JOIN_ROLES.map(({ id }) => {
			const profile = profiles.find((entry) => entry._id === `joinRole-${id}`);
			const copy = defaults.roles[id];
			const poster = profile?.posterUrl || undefined;
			return {
				id,
				anchor: text(profile?.anchor, copy.anchor),
				title: text(profile?.title, copy.title),
				lead: text(profile?.lead, copy.lead),
				text: text(profile?.text, copy.text),
				tags: tags(profile?.tags, [copy.tag1, copy.tag2]),
				cta: text(profile?.cta, copy.cta),
				message: text(
					profile?.message,
					defaults.message.replace("{role}", copy.verb),
				),
				video: profile?.videoUrl
					? { src: profile.videoUrl, poster }
					: undefined,
				poster,
			};
		}),
	};
}
