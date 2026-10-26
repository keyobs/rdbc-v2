import type { Locale } from "@i18n/index";
import AdvancedRules from "./AdvancedRules";
import NotionCard from "./NotionCard";
import type { Notion } from "./types";
import "./the-sport.css";

interface TheSportPageProps {
	notions: Notion[];
	advancedRules: Notion[];
	locale: Locale;
}

const TheSportPage = ({
	notions,
	advancedRules,
	locale,
}: TheSportPageProps) => {
	return (
		<main className="sport-page">
			<section className="sport-intro section">
				<div className="section__inner section__inner--split">
					<div className="sport-intro__heading">
						<span className="section__eyebrow">Roller Derby</span>

						<h1 className="section__title">
							Le
							<br />
							sport
						</h1>
					</div>

					<div className="sport-intro__content">
						<p className="section__lead">
							Le roller derby est un sport de contact, pratiqué en patins à
							roulettes de type quad, sur une piste ovale.
						</p>

						<p>
							Le but : Deux équipes s’affrontent au cours de séquences de jeu
							appelées jams. A chaque jam, une jammer de chaque équipe tente de
							dépasser les blockers adverses afin de marquer des points.
						</p>

						<p>
							Derrière ce principe simple se cache un sport rapide, stratégique,
							trés collectif et réclamant un engagement intense.
						</p>
					</div>
				</div>
			</section>

			<section className="basics section">
				<div className="section__inner">
					<header className="section__header">
						<span className="section__eyebrow">Comprendre le jeu</span>
						<h2 className="section__title">Les bases</h2>

						<p className="section__intro">
							Ces 8 notions suffisent pour comprendre ce qui se passe sur le
							track pendant un match.
						</p>
					</header>

					<div className="basics__grid">
						{notions.map((notion) => (
							<NotionCard
								key={notion.id}
								number={notion.number}
								title={notion.title[locale]}
								summary={notion.summary[locale]}
								detail={notion.detail[locale]}
							/>
						))}
					</div>
				</div>
			</section>

			<section className="track section">
				<div className="section__inner section__inner--split">
					<div className="track__visual">
						<div className="track-placeholder">
							<span>Schéma du track</span>
						</div>
					</div>

					<div className="track__content">
						<span className="section__eyebrow">L’espace de jeu</span>

						<h2 className="section__title">
							Le
							<br />
							track
						</h2>

						<p className="section__lead">
							Le roller derby se joue sur une piste ovale aux dimensions
							précisément définies.
						</p>

						<p>
							Le placement des joueuses, les limites du pack et les distances
							entre elles jouent un rôle essentiel dans les règles et la
							stratégie.
						</p>

						<a className="text-link" href="#advanced-rules">
							Comprendre les zones de jeu
							<span aria-hidden="true">→</span>
						</a>
					</div>
				</div>
			</section>

			<AdvancedRules rules={advancedRules} locale={locale} />
		</main>
	);
};

export default TheSportPage;
