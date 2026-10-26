import type { SanityClient } from "sanity";
import type { Notion } from "./types";

const NOTIONS_QUERY = `
	coalesce(*[_type == "sportNotionsSection"][0].notions, [
		{
			"_key": "teams",
			"number": "01",
			"title": { "fr": "Deux équipes", "en": "Two teams" },
			"summary": {
				"fr": "Deux équipes s’affrontent sur le track, cinq joueuses à la fois.",
				"en": "Two teams face off on the track, five skaters at a time."
			},
			"detail": {
				"fr": "1 jammer chargée de marquer des points et 4 blockers, qui jouent attaque et défense en même temps, en aidant leur jammer à passer tout en empêchant la progression de l’autre jammer.",
				"en": "1 jammer tasked with scoring points and 4 blockers, who play offense and defense at the same time, helping their jammer through while stopping the opposing jammer’s progress."
			}
		},
		{
			"_key": "points",
			"number": "02",
			"title": { "fr": "Des points", "en": "Points" },
			"summary": {
				"fr": "Le but du jeu est de marquer des points. Seules les jammers peuvent en marquer.",
				"en": "The goal is to score points. Only jammers can score."
			},
			"detail": {
				"fr": "Après son premier passage à travers le pack, la jammer marque un point pour chaque adversaire dépassée légalement à chaque tour suivant.",
				"en": "After her initial pass through the pack, the jammer scores a point for every opposing skater she legally passes on each subsequent lap."
			}
		},
		{
			"_key": "jams",
			"number": "03",
			"title": { "fr": "Des jams", "en": "Jams" },
			"summary": {
				"fr": "Le jeu est découpé en phases rapides appelées jams.",
				"en": "The game is split into fast-paced plays called jams."
			},
			"detail": {
				"fr": "Un jam dure au maximum 2 minutes, mais peut être interrompu avant sa fin naturelle si la Lead Jammer décide d’y mettre fin (« call off »).",
				"en": "A jam lasts up to 2 minutes, but can be ended early if the Lead Jammer calls it off."
			}
		},
		{
			"_key": "track",
			"number": "04",
			"title": { "fr": "Un track", "en": "The track" },
			"summary": {
				"fr": "Le track matérialise les limites de l’aire de jeu.",
				"en": "The track marks out the boundaries of the playing area."
			},
			"detail": {
				"fr": "Les actions doivent avoir lieu à l’intérieur des limites. Il est permis d’en sortir, mais dans ce cas, aucune action ne peut être exécutée ni initiée.",
				"en": "Actions must take place within the boundaries. Skaters may go out of bounds, but no action can be performed or initiated while out of bounds."
			}
		},
		{
			"_key": "pack",
			"number": "05",
			"title": { "fr": "Un pack", "en": "The pack" },
			"summary": {
				"fr": "Le pack matérialise la zone de jeu.",
				"en": "The pack marks out the zone of play."
			},
			"detail": {
				"fr": "Si le track délimite l’aire de jeu, le pack — le groupe de blockers le plus proche — délimite la zone où les actions de blocage sont autorisées.",
				"en": "If the track defines the playing area, the pack — the largest group of nearby blockers — defines the zone where blocking is allowed."
			}
		},
		{
			"_key": "direction",
			"number": "06",
			"title": { "fr": "Un sens", "en": "One direction" },
			"summary": {
				"fr": "Toutes les actions ont lieu dans le sens anti-horaire.",
				"en": "All actions happen counter-clockwise."
			},
			"detail": {
				"fr": "Marquer un point, bloquer une adversaire, aider sa jammer : toutes les actions doivent avoir lieu dans ce sens. Il reste permis de se déplacer dans les deux sens.",
				"en": "Scoring a point, blocking an opponent, helping your jammer: all actions must happen in this direction. Skating in either direction is still allowed."
			}
		},
		{
			"_key": "fouls",
			"number": "07",
			"title": { "fr": "Des fautes", "en": "Fouls" },
			"summary": {
				"fr": "Enfreindre les règles expose à une pénalité.",
				"en": "Breaking the rules risks a penalty."
			},
			"detail": {
				"fr": "Lorsqu’une joueuse enfreint les règles, elle commet une faute qui peut se transformer en pénalité : elle doit alors quitter le track pour purger 30 secondes en prison (penalty box).",
				"en": "When a skater breaks the rules, she commits a foul that can turn into a penalty: she must then leave the track to serve 30 seconds in the penalty box."
			}
		},
		{
			"_key": "contact",
			"number": "08",
			"title": { "fr": "Du contact", "en": "Contact" },
			"summary": {
				"fr": "La confrontation physique est autorisée et strictement encadrée.",
				"en": "Physical confrontation is allowed, and strictly regulated."
			},
			"detail": {
				"fr": "Les contacts physiques entre les joueureuses est encadrée par les règles du jeu, sur le principe d’assurer la sécurité des joueuses. Il est interdit de heurter la tête et le cou, de faire des croche-pattes ou de pousser dans le dos.",
				"en": "Physical contact between skaters is governed by the rules of the game, built around keeping skaters safe. Hitting the head or neck, tripping, or pushing from behind are all forbidden."
			}
		}
	])[]{
		"id": _key,
		number,
		title,
		summary,
		detail
	}
`;

export const getSportNotions = (
	sanityClient: SanityClient,
): Promise<Notion[]> => sanityClient.fetch(NOTIONS_QUERY);
