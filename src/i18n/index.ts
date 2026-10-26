import en from "./en";
import fr from "./fr";

export type Locale = "fr" | "en";

type DeepString<T> = {
	[K in keyof T]: T[K] extends Record<string, unknown>
		? DeepString<T[K]>
		: string;
};
export type Translations = DeepString<typeof fr>;

const translations: Record<Locale, Translations> = { fr, en };

export function useTranslations(locale: Locale = "fr"): Translations {
	return translations[locale] ?? translations.fr;
}
