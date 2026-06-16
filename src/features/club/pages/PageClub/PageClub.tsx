import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import type { ClubPage } from "../../../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import "./PageClub.css";

interface PageClubProps {
	data: ClubPage;
	locale: Locale;
}

const DUMMY_HISTORY_FR =
	"Fondé à Bordeaux en 2010, le Roller Derby Bordeaux Club (RDBC) est l'un des clubs pionniers du roller derby en France. Depuis ses débuts sur les parkings du Lac, le club a grandi pour former plusieurs équipes de compétition.";
const DUMMY_HISTORY_EN =
	"Founded in Bordeaux in 2010, Roller Derby Bordeaux Club (RDBC) is one of France's pioneering roller derby clubs. From its early days on the Lac car parks, the club has grown to field several competitive teams.";

const DUMMY_PHILOSOPHY_FR =
	"Le RDBC défend un sport inclusif, accessible à tous les genres et tous les niveaux. Pas de pré-requis sportif. Juste l'envie de se retrouver, de transpirer, et de construire quelque chose ensemble.";
const DUMMY_PHILOSOPHY_EN =
	"RDBC champions an inclusive sport, open to all genders and skill levels. No athletic prerequisites — just the desire to meet up, sweat, and build something together.";

const DUMMY_SPORT_FR =
	"Le roller derby est un sport de contact pratiqué sur patins à roulettes quad. Il est régi en France par la FFRS (Fédération Française de Roller et Skateboard) et au niveau international par la WFTDA (Women's Flat Track Derby Association). Deux équipes de 5 joueureuses s'affrontent sur une piste ovale.";
const DUMMY_SPORT_EN =
	"Roller derby is a full-contact sport played on quad roller skates. In France it is governed by the FFRS, and internationally by the WFTDA (Women's Flat Track Derby Association). Two teams of 5 skaters compete on an oval track.";

const DUMMY_VALUES = [
	{
		emoji: "💪",
		title: { fr: "Venez comme vous êtes", en: "Come as you are" },
		description: {
			fr: "Pour toustes, quel que soit le niveau.",
			en: "For everyone, regardless of skill level.",
		},
	},
	{
		emoji: "🔥",
		title: { fr: "Engagement", en: "Commitment" },
		description: {
			fr: "On joue dur, on s'entraîne dur, on s'amuse dur.",
			en: "We play hard, train hard, have fun hard.",
		},
	},
	{
		emoji: "✊",
		title: { fr: "Solidarité", en: "Solidarity" },
		description: {
			fr: "Le collectif avant tout — on se relève ensemble.",
			en: "The team above all — we rise together.",
		},
	},
];

const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
		},
	},
};

export default function PageClub({ data, locale }: PageClubProps) {
	const history = data.history?.[locale] ?? data.history?.fr;
	const philosophy = data.philosophy?.[locale] ?? data.philosophy?.fr;
	const sport = data.sport?.[locale] ?? data.sport?.fr;
	const values =
		data.values && data.values.length > 0 ? data.values : DUMMY_VALUES;

	const historyFallback = locale === "fr" ? DUMMY_HISTORY_FR : DUMMY_HISTORY_EN;
	const philosophyFallback =
		locale === "fr" ? DUMMY_PHILOSOPHY_FR : DUMMY_PHILOSOPHY_EN;
	const sportFallback = locale === "fr" ? DUMMY_SPORT_FR : DUMMY_SPORT_EN;

	return (
		<section
			className="page-club"
			aria-label={locale === "fr" ? "Le Club" : "The Club"}
		>
			{/* Patchwork background — static assets dropped here later */}
			<div className="page-club__bg" aria-hidden>
				<div className="page-club__bg-patch page-club__bg-patch--1" />
				<div className="page-club__bg-patch page-club__bg-patch--2" />
				<div className="page-club__bg-patch page-club__bg-patch--3" />
			</div>

			<div className="page-club__inner">
				{/* Full-width title banner */}
				<motion.h1
					className="page-club__title"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-40px" }}
				>
					Roller Derby
					<br />
					Bordeaux Club
				</motion.h1>

				{/* Desktop: 2 columns — Mobile: stacked */}
				<div className="page-club__grid">
					{/* Left column */}
					<div className="page-club__col">
						<motion.div
							className="page-club__block page-club__block--history"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<div
								className="page-club__tape page-club__tape--tl"
								aria-hidden
							/>
							<h2 className="page-club__block-title">
								{locale === "fr" ? "Notre histoire" : "Our story"}
							</h2>
							<div className="page-club__prose">
								{history && history.length > 0 ? (
									<PortableText value={history} />
								) : (
									<p>{historyFallback}</p>
								)}
							</div>
						</motion.div>

						<motion.div
							className="page-club__block page-club__block--philosophy"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<div
								className="page-club__tape page-club__tape--tr"
								aria-hidden
							/>
							<h2 className="page-club__block-title">
								{locale === "fr" ? "Notre philosophie" : "Our philosophy"}
							</h2>
							<div className="page-club__prose">
								{philosophy && philosophy.length > 0 ? (
									<PortableText value={philosophy} />
								) : (
									<p>{philosophyFallback}</p>
								)}
							</div>
						</motion.div>
					</div>

					{/* Right column */}
					<div className="page-club__col">
						<motion.div
							className="page-club__block page-club__block--values"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<h2 className="page-club__block-title">
								{locale === "fr" ? "Nos valeurs" : "Our values"}
							</h2>
							<ul className="page-club__values-list">
								{values.map((v, i) => (
									<li
										key={"_key" in v ? v._key : i}
										className="page-club__value-item"
									>
										{v.emoji && <span aria-hidden>{v.emoji}</span>}
										<strong>{v.title?.[locale] ?? v.title?.fr}</strong>
										<span>{v.description?.[locale] ?? v.description?.fr}</span>
									</li>
								))}
							</ul>
						</motion.div>

						<motion.div
							className="page-club__block page-club__block--sport"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<div
								className="page-club__tape page-club__tape--bl"
								aria-hidden
							/>
							<h2 className="page-club__block-title">
								{locale === "fr" ? "Le Sport" : "The Sport"}
							</h2>
							<div className="page-club__badges">
								<span className="page-club__badge">WFTDA</span>
								<span className="page-club__badge">FFRS</span>
							</div>
							<div className="page-club__prose">
								{sport && sport.length > 0 ? (
									<PortableText value={sport} />
								) : (
									<p>{sportFallback}</p>
								)}
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
