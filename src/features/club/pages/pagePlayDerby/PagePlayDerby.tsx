import { motion } from "motion/react";
import type { ClubPage } from "../../../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import ContactForm from "@components/contactForm/ContactForm";
import SignupBlock from "@components/signupBlock/SignupBlock";
import "./pagePlayDerby.css";

interface PagePlayDerbyProps {
	data: ClubPage;
	locale: Locale;
}

const DUMMY_SESSIONS = [
	{
		_key: "s1",
		label: { fr: "Session technique", en: "Skating training" },
		days: ["mardi"],
		time_start: "20:30",
		time_end: "22:30",
		location_name: "Antennes 2, Colette Besson, Bordeaux Lac",
		location_color: "green" as const,
		location_adress: "6 Cours Jules Ladoumegue, 33300 Bordeaux",
		maps_query:
			"https://www.google.com/maps/place/Plaine+des+Sports+Colette+Besson/@44.8983916,-0.5698651,954m/data=!3m1!1e3!4m6!3m5!1s0xd5529a69cec9705:0xf5532eeb64735653!8m2!3d44.8988362!4d-0.5674297!16s%2Fg%2F11b6b852rt?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
	},
	{
		_key: "s2",
		label: { fr: "Scrimmage", en: "Scrimmage" },
		days: ["vendredi"],
		time_start: "20:30",
		time_end: "22:00",
		location_name: "Antennes 2, Colette Besson, Bordeaux Lac",
		location_color: "green" as const,
		location_adress: "6 Cours Jules Ladoumegue, 33300 Bordeaux",
		maps_query:
			"https://www.google.com/maps/place/Plaine+des+Sports+Colette+Besson/@44.8983916,-0.5698651,954m/data=!3m1!1e3!4m6!3m5!1s0xd5529a69cec9705:0xf5532eeb64735653!8m2!3d44.8988362!4d-0.5674297!16s%2Fg%2F11b6b852rt?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
	},
	{
		_key: "s3",
		label: { fr: "Minipouces", en: "Starters" },
		days: ["samedi"],
		time_start: "11:00",
		time_end: "13:30",
		location_name: "Le Dépôt, Darwin",
		location_color: "yellow" as const,
		location_adress: "87 Quai des Queyries, Bordeaux",
		maps_query:
			"https://www.google.com/maps/place/87+Quai+des+Queyries,+33100+Bordeaux/@44.8481829,-0.5613773,803m/data=!3m1!1e3!4m14!1m7!3m6!1s0xd552881d2a1d2c5:0x2c84ad56e339ad2c!2sDarwin+Eco-syst%C3%A8me!8m2!3d44.8496336!4d-0.5610742!16s%2Fg%2F11h4pl6ch6!3m5!1s0xd55262a12814d05:0xf68acf7db2efe53!8m2!3d44.8485781!4d-0.559929!16s%2Fg%2F11c4v8djpp?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
	},
	{
		_key: "s4",
		label: { fr: "TTA", en: "TTA" },
		days: ["samedi"],
		time_start: "13:00",
		time_end: "17:00",
		location_name: "Le Dépôt, Darwin",
		location_color: "yellow" as const,
		location_adress: "87 Quai des Queyries, Bordeaux",
		maps_query:
			"https://www.google.com/maps/place/87+Quai+des+Queyries,+33100+Bordeaux/@44.8481829,-0.5613773,803m/data=!3m1!1e3!4m14!1m7!3m6!1s0xd552881d2a1d2c5:0x2c84ad56e339ad2c!2sDarwin+Eco-syst%C3%A8me!8m2!3d44.8496336!4d-0.5610742!16s%2Fg%2F11h4pl6ch6!3m5!1s0xd55262a12814d05:0xf68acf7db2efe53!8m2!3d44.8485781!4d-0.559929!16s%2Fg%2F11c4v8djpp?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
	},
	{
		_key: "s5",
		label: { fr: "Playschools", en: "Playschools" },
		days: ["samedi"],
		time_start: "15:00",
		time_end: "18:00",
		location_name: "Le Dépôt, Darwin",
		location_color: "yellow" as const,
		location_adress: "87 Quai des Queyries, Bordeaux",
		maps_query:
			"https://www.google.com/maps/place/87+Quai+des+Queyries,+33100+Bordeaux/@44.8481829,-0.5613773,803m/data=!3m1!1e3!4m14!1m7!3m6!1s0xd552881d2a1d2c5:0x2c84ad56e339ad2c!2sDarwin+Eco-syst%C3%A8me!8m2!3d44.8496336!4d-0.5610742!16s%2Fg%2F11h4pl6ch6!3m5!1s0xd55262a12814d05:0xf68acf7db2efe53!8m2!3d44.8485781!4d-0.559929!16s%2Fg%2F11c4v8djpp?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
	},
];

const DAYS_ORDER = [
	"lundi",
	"mardi",
	"mercredi",
	"jeudi",
	"vendredi",
	"samedi",
	"dimanche",
];

const DAY_LABEL: Record<string, Record<"fr" | "en", string>> = {
	lundi: { fr: "Lun", en: "Mon" },
	mardi: { fr: "Mar", en: "Tue" },
	mercredi: { fr: "Mer", en: "Wed" },
	jeudi: { fr: "Jeu", en: "Thu" },
	vendredi: { fr: "Ven", en: "Fri" },
	samedi: { fr: "Sam", en: "Sat" },
	dimanche: { fr: "Dim", en: "Sun" },
};

// Agenda rows: a session lands in the first slot whose end hour is after its start
const SLOT_END_HOURS = [13, 17, 19, 24];

function getSlot(timeStart?: string) {
	const hour = Number.parseInt(timeStart ?? "", 10);
	return Number.isNaN(hour)
		? 0
		: SLOT_END_HOURS.findIndex((endHour) => hour < endHour);
}

const LABELS = {
	fr: {
		pageTitle: "Faire du roller derby",
		trainingTitle: "Planning d'entraînement",
	},
	en: {
		pageTitle: "Play roller derby",
		trainingTitle: "Training schedule",
	},
};

function getMapsUrl(query: string) {
	return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

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

export default function PagePlayDerby({ data, locale }: PagePlayDerbyProps) {
	const t = LABELS[locale];
	const sessions =
		data.training_sessions && data.training_sessions.length > 0
			? data.training_sessions
			: DUMMY_SESSIONS;

	return (
		<section className="page-derby" aria-label={t.pageTitle}>
			<div className="inner">
				<motion.h2
					className="page-title"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-40px" }}
				>
					{t.pageTitle}
				</motion.h2>

				<div className="grid">
					<div className="col">
						<motion.div
							className="training"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<h3 className="section-title">{t.trainingTitle}</h3>
							<div className="agenda">
								<div className="head">
									{DAYS_ORDER.map((day) => (
										<span key={day} className="day">
											{DAY_LABEL[day][locale]}
										</span>
									))}
								</div>
								{SLOT_END_HOURS.map((endHour, slot) => (
									<div key={endHour} className="row">
										{DAYS_ORDER.map((day) => (
											<div
												key={day}
												className={day === "samedi" ? "cell centered" : "cell"}
											>
												{sessions
													.filter(
														(s) =>
															s.days?.includes(day) &&
															getSlot(s.time_start) === slot,
													)
													.map((session) => (
														<div
															key={session._key}
															className={`session ${session.location_color ?? "green"}`}
														>
															<span className="time">{session.time_start}</span>
															<span className="label">
																{session.label?.[locale] ?? session.label?.fr}
															</span>
														</div>
													))}
											</div>
										))}
									</div>
								))}
							</div>
							<div className="maps-links">
								{[
									...new Set(
										sessions.map((s) => s.maps_query ?? s.location_name ?? ""),
									),
								]
									.filter(Boolean)
									.map((query) => {
										const place = sessions.find(
											(s) => (s.maps_query ?? s.location_name) === query,
										);
										return (
											<a
												key={query}
												href={getMapsUrl(query)}
												target="_blank"
												rel="noopener noreferrer"
											>
												<span
													className={`swatch ${place?.location_color ?? "green"}`}
													aria-hidden
												/>
												{place?.location_name ?? query}
											</a>
										);
									})}
							</div>
						</motion.div>

						<motion.div
							className="signup"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<SignupBlock data={data} locale={locale} />
						</motion.div>
					</div>

					<div className="col">
						<motion.div
							className="illustration"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
							aria-hidden
						>
							{/* Static asset injected here once provided */}
							<div className="placeholder">
								<span>✦ illustration à venir ✦</span>
							</div>
						</motion.div>

						<motion.div
							className="contact"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<ContactForm locale={locale} />
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
