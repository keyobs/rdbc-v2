export interface LocalizedString {
	fr: string;
	en: string;
}

export interface Notion {
	id: string;
	number: string;
	title: LocalizedString;
	summary: LocalizedString;
	detail: LocalizedString;
}
