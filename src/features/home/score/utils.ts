export function formatGameDate(isoDate: string, locale = "fr-FR"): string {
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(isoDate));
}
