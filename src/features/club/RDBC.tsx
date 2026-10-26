import type { ClubPage } from "../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import PageClub from "./pages/PageClub/PageClub";
import PageClubLife from "./pages/PageClubLife/PageClubLife";
import PagePlayDerby from "./pages/PagePlayDerby/PagePlayDerby";
import "./RDBC.css";

interface RDBCProps {
	data: ClubPage;
	locale: Locale;
}

export default function RDBC({ data, locale }: RDBCProps) {
	return (
		<main className="rdbc-book">
			<PageClub data={data} locale={locale} />
			<PageClubLife data={data} locale={locale} />
			<PagePlayDerby data={data} locale={locale} />
		</main>
	);
}
