import "./the-sport.css";

const basics = [
	{
		id: "teams",
		number: "01",
		title: "Deux équipes",
		description:
			"Deux équipes s’affrontent sur le track. Chacune aligne jusqu’à cinq joueuses à la fois.",
	},
	{
		id: "jammer",
		number: "02",
		title: "Jammer",
		description: "La Jammer marque les points en dépassant les adversaires.",
	},
	{
		id: "blockers",
		number: "03",
		title: "Les Blockers",
		description:
			"Les blockers forment le pack et cherchent à aider leur jammer tout en ralentissant la jammer de l’équipe adverse.",
	},
	{
		id: "jams",
		number: "04",
		title: "Les jams",
		description:
			"Un match est découpé en séquences de jeu courtes appelées jams. Chaque jam peut durer jusqu'à 2 minutes. Le Lead Jammer a l'avantage de pouvoir mettre fin à un jam avant sa fin naturelle.",
	},
	{
		id: "contact",
		number: "05",
		title: "Le contact",
		description:
			"Le contact est autorisé mais strictement encadré : zones de contact, zones cibles et engagements sont réglementés.",
	},
	{
		id: "points",
		number: "06",
		title: "Les points",
		description:
			"Après son passage initial, la jammer marque un point pour chaque adversaire dépassée légalement.",
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
							Le but Deux équipes s’affrontent au cours de séquences de jeu
							appelées jams. Pendant chacune d’elles, une joueuse de chaque
							équipe tente de dépasser les joueuses adverses afin de marquer des
							points.
						</p>

						<p>
							Derrière ce principe simple se cache un sport rapide, stratégique
							et très collectif.
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
							Six notions suffisent pour comprendre ce qui se passe sur le track
							pendant un match.
						</p>
					</header>

					<div className="basics__grid">
						{basics.map((basic) => (
							<article key={basic.id} className="basic-card">
								<span className="basic-card__number">{basic.number}</span>

								<h3 className="basic-card__title">{basic.title}</h3>

								<p className="basic-card__description">{basic.description}</p>
							</article>
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
							Les règles du jeu
							<br />
							avancées
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
