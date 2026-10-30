import type { SanityClient } from "sanity";
import type { Player, Season } from "../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import { urlFor } from "@utils/sanityImage";
import type { TeamMember } from "./roster";

export interface TeamsData {
	members: TeamMember[];
	captions: { A: string; B: string };
}

export async function getTeamsData(
	client: SanityClient,
	locale: Locale,
	season: string,
): Promise<TeamsData> {
	const [players, caption] = await Promise.all([
		client.fetch<Player[]>(
			'*[_type == "player" && defined(derby_name)] | order(derby_name asc, _id asc)',
		),
		client.fetch<Season | null>('*[_type == "season" && name == $season][0]', {
			season,
		}),
	]);
	return {
		members: players
			.filter((player) => player.derby_name?.trim())
			.map((player) => ({
				_id: player._id,
				name: player.derby_name?.trim() ?? "",
				category: player.category,
				team: player.team,
				intraligue: player.intraligue,
				number: player.number,
				role: player.role,
				official_roles: player.official_roles,
				generation: player.generation,
				first_season: player.first_season,
				last_season: player.last_season,
				standby: player.standby,
				hall_of_fame: player.hall_of_fame,
				in_roster: player.in_roster,
				photoUrl: player.photo?.asset
					? urlFor(player.photo)
							.width(640)
							.height(840)
							.fit("crop")
							.auto("format")
							.url()
					: null,
				anecdote:
					(locale === "en" ? player.misc_en?.trim() : "") ||
					player.misc?.trim() ||
					"",
			})),
		captions: {
			A:
				caption?.captionA?.[locale]?.trim() ||
				caption?.captionA?.fr?.trim() ||
				"",
			B:
				caption?.captionB?.[locale]?.trim() ||
				caption?.captionB?.fr?.trim() ||
				"",
		},
	};
}
