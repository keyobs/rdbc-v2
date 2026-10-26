import type { SanityClient } from "sanity";
import type { Locale } from "@i18n/index";
import type { JoiningPosition } from "./ClubJoining";

// The fallback is used until a `homeJoiningSection` document is published.
// `href` stays empty until the join page has its sections.
const JOINING_POSITIONS_QUERY = `
	coalesce(*[_type == "homeJoiningSection"][0].positions, [
		{
			"_key": "player",
			"title": { "fr": "Jouer", "en": "Play" },
			"description": {
				"fr": "Roller derby pour toustes.",
				"en": "Roller derby for everyone."
			},
			"icon": "play",
			"href": null
		},
		{
			"_key": "referee",
			"title": { "fr": "Arbitrer", "en": "Referee" },
			"description": {
				"fr": "Sur patins ou en baskets, un crew d'arbitres compte une vingtaine de membres.",
				"en": "On skates or in sneakers, a referee crew has about twenty members."
			},
			"icon": "referee",
			"href": null
		},
		{
			"_key": "staff",
			"title": { "fr": "Accompagner", "en": "Support" },
			"description": {
				"fr": "[Description à rédiger]",
				"en": "[Description to write]"
			},
			"icon": "support",
			"href": null
		},
		{
			"_key": "volunteer",
			"title": { "fr": "Kiffer", "en": "Enjoy" },
			"description": {
				"fr": "Bénévole, supporter, il y a toujours une place, sinon on se serre.",
				"en": "Volunteer, supporter, there is always room, and if not we squeeze in."
			},
			"icon": "fun",
			"href": null
		}
	])[]{
		"id": _key,
		"title": coalesce(title[$locale], title.fr, title.en),
		"description": coalesce(description[$locale], description.fr, description.en),
		icon,
		href
	}
`;

export const getJoiningPositions = (
	sanityClient: SanityClient,
	locale: Locale,
): Promise<JoiningPosition[]> =>
	sanityClient.fetch(JOINING_POSITIONS_QUERY, { locale });
