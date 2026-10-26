import type { SanityClient } from "sanity";
import type { Locale } from "@i18n/index";

export interface HomeAlertContent {
	/** Pill text. `null` when the editors left it empty: the default label is used. */
	label: string | null;
	title: string;
	/** Date, time, platform… */
	meta: string | null;
	href: string;
	linkLabel: string;
}

// A single document: the banner only exists while it is switched on in the Studio.
const HOME_ALERT_QUERY = `
	*[_type == "homeAlert" && active == true][0]{
		"label": coalesce(label[$locale], label.fr),
		"title": coalesce(message[$locale], message.fr),
		"meta": coalesce(meta[$locale], meta.fr),
		"href": link.href,
		"linkLabel": coalesce(link.label[$locale], link.label.fr)
	}
`;

export const getHomeAlert = async (
	sanityClient: SanityClient,
	locale: Locale,
): Promise<HomeAlertContent | null> => {
	const alert = await sanityClient.fetch<HomeAlertContent | null>(
		HOME_ALERT_QUERY,
		{ locale },
	);
	// Without a message, a link and a button text there is nothing worth showing
	if (!alert?.title || !alert.href || !alert.linkLabel) return null;
	return alert;
};
