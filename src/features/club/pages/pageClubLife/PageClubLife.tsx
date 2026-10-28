import type { ClubPage } from "../../../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import { urlFor } from "@utils/sanityImage";
import Reveal from "@components/reveal/Reveal";
import "./pageClubLife.css";

interface PageClubLifeProps {
	data: ClubPage;
	locale: Locale;
}

const DUMMY_ROLES = [
	{
		_key: "r1",
		title: { fr: "Joueureuses", en: "Skaters" },
		description: {
			fr: "Jammers, blockers, pivots — elles constituent le cœur de la piste. Le jammer marque les points en dépassant les adversaires. Les blockers forment le pack et bloquent. Le pivot gère la défense et peut devenir jammer.",
			en: "Jammers, blockers, pivots — they are the heart of the track. The jammer scores by lapping the opposition. Blockers form the pack and defend. The pivot leads defense and can become the jammer.",
		},
		photo: null as null,
	},
	{
		_key: "r2",
		title: { fr: "Arbitres", en: "Referees" },
		description: {
			fr: "Sur patins ou à pied, les arbitres font respecter les règles avec précision. Sans eux, pas de derby. Le RDBC forme ses propres arbitres et les encourage à officier lors de matchs extérieurs.",
			en: "On skates or on foot, refs enforce the rules with precision. No derby without them. RDBC trains its own referees and encourages them to officiate at outside bouts.",
		},
		photo: null as null,
	},
	{
		_key: "r3",
		title: { fr: "Bénévoles NSO", en: "NSO Volunteers" },
		description: {
			fr: "Non-Skating Officials — les héros de l'ombre. Score, chrono, pénalités, suivi des jammers : sans les NSO, un match ne peut pas se tenir. Un rôle idéal pour qui veut s'investir sans (encore) chausser les patins.",
			en: "Non-Skating Officials — the unsung heroes. Score, timing, penalties, jammer tracking: without NSOs, no bout can run. Perfect for anyone who wants to get involved before lacing up.",
		},
		photo: null as null,
	},
];

const DUMMY_ACTIVITIES = [
	{
		_key: "a1",
		title: { fr: "Les entraînements", en: "Training sessions" },
		text: {
			fr: "Deux fois par semaine à Bordeaux, le RDBC ouvre ses entraînements à toutes et tous. Niveau débutant à confirmé, patins fournis pour les premières séances.",
			en: "Twice a week in Bordeaux, RDBC opens its practices to everyone. Beginner to advanced, skates provided for first sessions.",
		},
		photo: null as null,
	},
	{
		_key: "a2",
		title: { fr: "Les matchs à domicile", en: "Home bouts" },
		text: {
			fr: "Les matchs à domicile sont une fête. Les équipes font le spectacle, le public s'enthousiasme, et l'ambiance dépasse largement le sport. Entrée libre ou à prix libre selon les événements.",
			en: "Home bouts are a party. The teams put on a show, the crowd gets fired up, and the atmosphere goes well beyond sport. Free entry or pay-what-you-can depending on the event.",
		},
		photo: null as null,
	},
	{
		_key: "a3",
		title: { fr: "Les déplacements", en: "Away games" },
		text: {
			fr: "Le RDBC participe à des tournois partout en France et en Europe. Une occasion unique de découvrir la culture derby d'autres villes, et de représenter Bordeaux avec flamboyance.",
			en: "RDBC competes in tournaments across France and Europe. A unique chance to discover derby culture in other cities and represent Bordeaux in flamboyant style.",
		},
		photo: null as null,
	},
	{
		_key: "a4",
		title: { fr: "Les championnats", en: "Championships" },
		text: {
			fr: "Membre WFTDA, nous tentons saison après saison de nous hisser toujours plus haut. Aussi affilié FFRS, le RDBC est engagé  dans le championnat de France. Des objectifs sportifs concrets qui occupent toute la saison.",
			en: "As a WFTDA member, we strive season after season to climb ever higher. Also affiliated with FFRS, RDBC competes in the French championship. Concrete sporting goals that keep us busy all season long.",
		},
		photo: null as null,
	},
];

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.45,
			ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
		},
	},
};

export default function PageClubLife({ data, locale }: PageClubLifeProps) {
	const roles = data.roles && data.roles.length > 0 ? data.roles : DUMMY_ROLES;
	const activities =
		data.activities && data.activities.length > 0
			? data.activities
			: DUMMY_ACTIVITIES;

	return (
		<section
			className="page-vie"
			aria-label={locale === "fr" ? "La Vie du Club" : "Club Life"}
		>
			<div className="page-vie__inner">
				<Reveal as="h2" className="page-vie__page-title" variants={fadeUp}>
					{locale === "fr" ? "La Vie du Club" : "Club Life"}
				</Reveal>

				<div className="page-vie__grid">
					{/* Left column — Roles (disc review style) */}
					<div className="page-vie__col page-vie__col--roles">
						<h3 className="page-vie__col-title">
							{locale === "fr" ? "Qui sommes-nous ?" : "Who are we?"}
						</h3>
						<ul className="page-vie__roles">
							{roles.map((role) => {
								const imgSrc = role.photo
									? urlFor(role.photo).width(160).height(160).fit("crop").url()
									: null;

								return (
									<Reveal
										as="li"
										key={role._key ?? role.title?.fr}
										className="page-vie__role"
										variants={fadeUp}
										margin="-30px"
									>
										<div className="page-vie__role-cover">
											{imgSrc ? (
												<img
													src={imgSrc}
													alt={role.title?.[locale] ?? role.title?.fr ?? ""}
													className="page-vie__role-img"
												/>
											) : (
												<div
													className="page-vie__role-img-placeholder"
													aria-hidden
												/>
											)}
										</div>
										<div className="page-vie__role-review">
											<strong className="page-vie__role-title">
												{role.title?.[locale] ?? role.title?.fr}
											</strong>
											<p className="page-vie__role-desc">
												{role.description?.[locale] ?? role.description?.fr}
											</p>
										</div>
									</Reveal>
								);
							})}
						</ul>
					</div>

					{/* Right column — Activities (alternating photo + text) */}
					<div className="page-vie__col page-vie__col--activities">
						<h3 className="page-vie__col-title">
							{locale === "fr" ? "Nos activités" : "Our activities"}
						</h3>
						<ul className="page-vie__activities">
							{activities.map((activity, i) => {
								const imgSrc = activity.photo
									? urlFor(activity.photo)
											.width(220)
											.height(160)
											.fit("crop")
											.url()
									: null;
								const isEven = i % 2 === 0;

								return (
									<Reveal
										as="li"
										key={activity._key ?? i}
										className={`page-vie__activity page-vie__activity--${isEven ? "photo-left" : "photo-right"}`}
										variants={fadeUp}
										margin="-30px"
									>
										<div className="page-vie__activity-photo">
											{imgSrc ? (
												<img
													src={imgSrc}
													alt={
														activity.title?.[locale] ?? activity.title?.fr ?? ""
													}
													className="page-vie__activity-img"
												/>
											) : (
												<div
													className="page-vie__activity-img-placeholder"
													aria-hidden
												/>
											)}
										</div>
										<div className="page-vie__activity-text">
											<strong className="page-vie__activity-title">
												{activity.title?.[locale] ?? activity.title?.fr}
											</strong>
											<p>{activity.text?.[locale] ?? activity.text?.fr}</p>
										</div>
									</Reveal>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
