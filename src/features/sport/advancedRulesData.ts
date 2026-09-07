import type { SanityClient } from "sanity";
import type { Notion } from "./types";

const PLACEHOLDER_SUMMARY = { fr: "À venir", en: "Coming soon" };
const PLACEHOLDER_DETAIL = {
	fr: "Contenu à venir.",
	en: "Content coming soon.",
};

const ADVANCED_RULES_QUERY = `
	coalesce(*[_type == "advancedRulesSection"][0].rules, [
		{ "_key": "jam", "number": "01", "title": { "fr": "Un Jam", "en": "A jam" } },
		{ "_key": "points", "number": "02", "title": { "fr": "Les Points", "en": "Points" } },
		{ "_key": "pack", "number": "03", "title": { "fr": "Le Pack", "en": "The pack" } },
		{ "_key": "lead-jammer", "number": "04", "title": { "fr": "Lead Jammer", "en": "Lead Jammer" } },
		{ "_key": "no-lead-jammer", "number": "05", "title": { "fr": "NoLead Jammer", "en": "No Lead Jammer" } },
		{ "_key": "initial-pass", "number": "06", "title": { "fr": "L’initial Pass", "en": "Initial Pass" } },
		{ "_key": "scoring-pass", "number": "07", "title": { "fr": "Le Passage au Score", "en": "Scoring pass" } },
		{ "_key": "star-pass", "number": "08", "title": { "fr": "Le Star Pass", "en": "Star pass" } },
		{ "_key": "basic-strategies", "number": "09", "title": { "fr": "Stratégies de Bases", "en": "Basic strategies" } },
		{ "_key": "advanced-strategies", "number": "10", "title": { "fr": "Stratégies Avancées", "en": "Advanced strategies" } },
		{ "_key": "penalties", "number": "11", "title": { "fr": "Les Pénalités", "en": "Penalties" } },
		{ "_key": "position-fouls", "number": "12", "title": { "fr": "Les fautes de Position", "en": "Positional fouls" } },
		{ "_key": "pack-fouls", "number": "13", "title": { "fr": "Les fautes de Pack", "en": "Pack fouls" } },
		{ "_key": "contact-fouls", "number": "14", "title": { "fr": "Les fautes de Contact", "en": "Contact fouls" } },
		{ "_key": "gameplay-fouls", "number": "15", "title": { "fr": "Les fautes de Jeu", "en": "Gameplay fouls" } },
		{ "_key": "penalty-box", "number": "16", "title": { "fr": "La Prison", "en": "The penalty box" } }
	])[]{
		"id": _key,
		number,
		title,
		"summary": coalesce(summary, ${JSON.stringify(PLACEHOLDER_SUMMARY)}),
		"detail": coalesce(detail, ${JSON.stringify(PLACEHOLDER_DETAIL)})
	}
`;

export const getAdvancedRules = (
	sanityClient: SanityClient,
): Promise<Notion[]> => sanityClient.fetch(ADVANCED_RULES_QUERY);
