import NotionCard from "./NotionCard";
import "./the-sport.css";

const notions = [
	{
		id: "teams",
		number: "01",
		title: "Deux équipes",
		summary: "Deux équipes s’affrontent sur le track, cinq joueuses à la fois.",
		detail:
			"1 jammer chargée de marquer des points et 4 blockers, qui jouent attaque et défense en même temps, en aidant leur jammer à passer tout en empêchant la progression de l’autre jammer.",
	},
	{
		id: "points",
		number: "02",
		title: "Des points",
		summary:
			"Le but du jeu est de marquer des points. Seules les jammers peuvent en marquer.",
		detail:
			"Après son premier passage à travers le pack, la jammer marque un point pour chaque adversaire dépassée légalement à chaque tour suivant.",
	},
	{
		id: "jams",
		number: "03",
		title: "Des jams",
		summary: "Le jeu est découpé en phases rapides appelées jams.",
		detail:
			"Un jam dure au maximum 2 minutes, mais peut être interrompu avant sa fin naturelle si la Lead Jammer décide d’y mettre fin (« call off »).",
	},
	{
		id: "track",
		number: "04",
		title: "Un track",
		summary: "Le track matérialise les limites de l’aire de jeu.",
		detail:
			"Les actions doivent avoir lieu à l’intérieur des limites. Il est permis d’en sortir, mais dans ce cas, aucune action ne peut être exécutée ni initiée.",
	},
	{
		id: "pack",
		number: "05",
		title: "Un pack",
		summary: "Le pack matérialise la zone de jeu.",
		detail:
			"Si le track délimite l’aire de jeu, le pack — le groupe de blockers le plus proche — délimite la zone où les actions de blocage sont autorisées.",
	},
	{
		id: "direction",
		number: "06",
		title: "Un sens",
		summary: "Toutes les actions ont lieu dans le sens anti-horaire.",
		detail:
			"Marquer un point, bloquer une adversaire, aider sa jammer : toutes les actions doivent avoir lieu dans ce sens. Il reste permis de se déplacer dans les deux sens.",
	},
	{
		id: "fouls",
		number: "07",
		title: "Des fautes",
		summary: "Enfreindre les règles expose à une pénalité.",
		detail:
			"Lorsqu’une joueuse enfreint les règles, elle commet une faute qui peut se transformer en pénalité : elle doit alors quitter le track pour purger 30 secondes en prison (penalty box).",
	},
	{
		id: "contact",
		number: "08",
		title: "Du contact",
		summary: "La confrontation physique est autorisée et strictement encadrée.",
		detail:
			"Les contacts physiques entre les joueureuses est encadrée par les règles du jeu, sur le principe d’assurer la sécurité des joueuses. Il est interdit de heurter la tête et le cou, de faire des croche-pattes ou de pousser dans le dos.",
	},
];

const TheSportPage = () => {
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
							appelées jams. Pendant chacune d’elles, une joueuse de chaque
							équipe tente de dépasser les joueuses adverses afin de marquer des
							points.
						</p>

						<p>
							Derrière ce principe simple se cache un sport rapide, stratégique,
							réclamant un engagement intense, et très collectif.
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
								title={notion.title}
								summary={notion.summary}
								detail={notion.detail}
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

			<section id="advanced-rules" className="advanced-rules section">
				<div className="section__inner">
					<header className="section__header section__header--narrow">
						<span className="section__eyebrow">Pour aller plus loin</span>

						<h2 className="section__title">
							Les règles <br /> du jeu
						</h2>

						<p className="section__intro">
							Une fois les bases acquises, quelques notions permettent de mieux
							comprendre les stratégies, les pénalités et les décisions
							arbitrales.
						</p>
					</header>

					<div className="advanced-rules__grid">
						<article className="rule-card">
							<span>01</span>
							<h3>Le pack</h3>
							<p>
								Comprendre comment il est défini, quand il existe et pourquoi sa
								position détermine les zones d’engagement.
							</p>
						</article>

						<article className="rule-card">
							<span>02</span>
							<h3>Lead jammer</h3>
							<p>
								La première jammer éligible peut obtenir le statut de Lead
								Jammer et décider d’arrêter le jam.
							</p>
						</article>

						<article className="rule-card">
							<span>03</span>
							<h3>Engagement</h3>
							<p>
								Les blockers ne peuvent pas initier un contact n’importe où,
								n’importe comment ou contre n’importe quelle zone du corps.
							</p>
						</article>

						<article className="rule-card">
							<span>04</span>
							<h3>Les pénalités</h3>
							<p>
								Certaines actions illégales conduisent à une pénalité et à un
								passage temporaire en penalty box.
							</p>
						</article>
					</div>
				</div>
			</section>
		</main>
	);
};

export default TheSportPage;
