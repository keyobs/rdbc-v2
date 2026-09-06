import type { SanityClient } from "sanity";
import type { JoiningPosition } from "./ClubJoining";

const JOINING_POSITIONS_QUERY = `
	coalesce(*[_type == "homeJoiningSection"][0].positions, [
		{
			"_key": "player",
			"title": { "fr": "Jouer" },
			"description": { "fr": "roller derby pour toustes" },
			"icon": "🛼"
		},
		{
			"_key": "referee",
			"title": { "fr": "Arbitrer" },
			"description": { "fr": "Sur patins ou en baskets, un crew d'arbitres compte une vingtaine de membres." },
			"icon": "🏁"
		},
		{
			"_key": "staff",
			"title": { "fr": "Accompagner" },
			"description": { "fr": "help me" },
			"icon": "📢"
		},
		{
			"_key": "volunteer",
			"title": { "fr": "Kiffer" },
			"description": { "fr": "Bénévole, supporter, il y a toujours une place, sinon on se serre." },
			"icon": "💪"
		}
	])[]{
		"id": _key,
		"title": coalesce(title.fr, title.en),
		"description": coalesce(description.fr, description.en),
		icon
	}
`;

export const getJoiningPositions = (
	sanityClient: SanityClient,
): Promise<JoiningPosition[]> => sanityClient.fetch(JOINING_POSITIONS_QUERY);
