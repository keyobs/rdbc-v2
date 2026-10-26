import { useState } from "react";
import { motion } from "framer-motion";
import type { ClubPage } from "../../../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import "./PagePlayDerby.css";

interface PagePlayDerbyProps {
	data: ClubPage;
	locale: Locale;
}

const DUMMY_SESSIONS = [
	{
		_key: "s1",
		label: { fr: "Session technique", en: "Skating training" },
		days: ["mercredi"],
		time_start: "19:30",
		time_end: "21:30",
		location_name: "Le Dépôt, Darwin",
		location_adress: "87 Quai des Queyries, Bordeaux",
		maps_query:
			"https://www.google.com/maps/place/87+Quai+des+Queyries,+33100+Bordeaux/@44.8481829,-0.5613773,803m/data=!3m1!1e3!4m14!1m7!3m6!1s0xd552881d2a1d2c5:0x2c84ad56e339ad2c!2sDarwin+Eco-syst%C3%A8me!8m2!3d44.8496336!4d-0.5610742!16s%2Fg%2F11h4pl6ch6!3m5!1s0xd55262a12814d05:0xf68acf7db2efe53!8m2!3d44.8485781!4d-0.559929!16s%2Fg%2F11c4v8djpp?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
	},
	{
		_key: "s2",
		label: { fr: "Scrimmage", en: "Scrimmage" },
		days: ["vendredi"],
		time_start: "20:30",
		time_end: "22:00",
		location_name: "Antennes 2, Colette Besson, Bordeaux Lac",
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
		location_adress: "87 Quai des Queyries, Bordeaux",
		maps_query:
			"https://www.google.com/maps/place/87+Quai+des+Queyries,+33100+Bordeaux/@44.8481829,-0.5613773,803m/data=!3m1!1e3!4m14!1m7!3m6!1s0xd552881d2a1d2c5:0x2c84ad56e339ad2c!2sDarwin+Eco-syst%C3%A8me!8m2!3d44.8496336!4d-0.5610742!16s%2Fg%2F11h4pl6ch6!3m5!1s0xd55262a12814d05:0xf68acf7db2efe53!8m2!3d44.8485781!4d-0.559929!16s%2Fg%2F11c4v8djpp?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
	},
	{
		_key: "s4",
		label: { fr: "Intermédiaires, Avancés", en: "Advanced skaters" },
		days: ["samedi"],
		time_start: "14:00",
		time_end: "17:00",
		location_name: "Le Dépôt, Darwin",
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

const INTERESTS_FR = [
	"Jouer",
	"Essayer",
	"Arbitrer",
	"Venir voir",
	"Filer un coup de main",
	"Dire bonjour",
];
const INTERESTS_EN = [
	"Play",
	"Try it out",
	"Referee",
	"Come watch",
	"Volunteer",
	"Say hi",
];

const LABELS = {
	fr: {
		pageTitle: "Faire du roller derby",
		trainingTitle: "Planning d'entraînement",
		inscriptionTitle: "S'inscrire",
		inscriptionBtn: "S'inscrire sur HelloAsso",
		formTitle: "Nous contacter",
		name: "Prénom",
		interests: "Je suis intéressé·e par",
		email: "Email",
		message: "Message",
		send: "Envoyer →",
		sent: "Message envoyé — à très vite !",
		openMaps: "Voir sur Maps",
	},
	en: {
		pageTitle: "Play roller derby",
		trainingTitle: "Training schedule",
		inscriptionTitle: "Sign up",
		inscriptionBtn: "Sign up on HelloAsso",
		formTitle: "Contact us",
		name: "First name",
		interests: "I'm interested in",
		email: "Email",
		message: "Message",
		send: "Send →",
		sent: "Message sent — see you soon!",
		openMaps: "View on Maps",
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
	const inscriptionUrl = data.inscription_url ?? "https://www.helloasso.com";
	const joinEmail = data.join_email ?? "contact@rdbcbordeaux.fr";
	const joinInfo = data.join_info?.[locale] ?? data.join_info?.fr;
	const interests = locale === "fr" ? INTERESTS_FR : INTERESTS_EN;

	const [sent, setSent] = useState(false);
	const [checked, setChecked] = useState<string[]>([]);

	function toggleInterest(item: string) {
		setChecked((prev) =>
			prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
		);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const name = (form.elements.namedItem("name") as HTMLInputElement).value;
		const email = (form.elements.namedItem("email") as HTMLInputElement).value;
		const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
			.value;
		const interestLine =
			checked.length > 0 ? `Intérêts : ${checked.join(", ")}\n` : "";
		const body = encodeURIComponent(
			`Prénom : ${name}\nEmail : ${email}\n${interestLine}\n${message}`,
		);
		const subject = encodeURIComponent(
			locale === "fr" ? "Contact RDBC" : "RDBC Contact",
		);
		window.location.href = `mailto:${joinEmail}?subject=${subject}&body=${body}`;
		setSent(true);
	}

	return (
		<section className="page-derby" aria-label={t.pageTitle}>
			<div className="page-derby__inner">
				<motion.h2
					className="page-derby__page-title"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-40px" }}
				>
					{t.pageTitle}
				</motion.h2>

				<div className="page-derby__grid">
					{/* Left column */}
					<div className="page-derby__col">
						{/* Top 50% — Training schedule */}
						<motion.div
							className="page-derby__training"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<h3 className="page-derby__section-title">{t.trainingTitle}</h3>
							<div className="page-derby__agenda">
								{/* Header row — days */}
								<div className="page-derby__agenda-head">
									{DAYS_ORDER.map((day) => (
										<span key={day} className="page-derby__agenda-day">
											{DAY_LABEL[day][locale]}
										</span>
									))}
								</div>
								{/* Session rows */}
								{sessions.map((session) => (
									<div key={session._key} className="page-derby__agenda-row">
										{DAYS_ORDER.map((day) => {
											const active = session.days?.includes(day);
											return (
												<div
													key={day}
													className={`page-derby__agenda-cell${active ? " page-derby__agenda-cell--active" : ""}`}
												>
													{active && (
														<>
															<span className="page-derby__agenda-time">
																{session.time_start}
															</span>
															<span className="page-derby__agenda-label">
																{session.label?.[locale] ?? session.label?.fr}
															</span>
														</>
													)}
												</div>
											);
										})}
									</div>
								))}
							</div>
							{/* Maps links */}
							<div className="page-derby__maps-links">
								{[
									...new Set(
										sessions.map((s) => s.maps_query ?? s.location_name ?? ""),
									),
								]
									.filter(Boolean)
									.map((query) => (
										<a
											key={query}
											href={getMapsUrl(query)}
											target="_blank"
											rel="noopener noreferrer"
											className="page-derby__maps-btn"
										>
											{t.openMaps} —{" "}
											{sessions.find(
												(s) => (s.maps_query ?? s.location_name) === query,
											)?.location_name ?? query}
										</a>
									))}
							</div>
						</motion.div>

						{/* Bottom 50% — Inscription */}
						<motion.div
							className="page-derby__inscription"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<h3 className="page-derby__section-title">
								{t.inscriptionTitle}
							</h3>
							{joinInfo && (
								<p className="page-derby__inscription-text">{joinInfo}</p>
							)}
							<a
								href={inscriptionUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="page-derby__inscription-btn"
							>
								{t.inscriptionBtn}
							</a>
						</motion.div>
					</div>

					{/* Right column */}
					<div className="page-derby__col">
						{/* Top 50% — Illustration placeholder */}
						<motion.div
							className="page-derby__illustration"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
							aria-hidden
						>
							{/* Static asset injected here once provided */}
							<div className="page-derby__illustration-placeholder">
								<span>✦ illustration à venir ✦</span>
							</div>
						</motion.div>

						{/* Bottom 50% — Contact form */}
						<motion.div
							className="page-derby__form-wrap"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<h3 className="page-derby__section-title">{t.formTitle}</h3>
							<div className="page-derby__coupon">
								<div className="page-derby__scissors" aria-hidden>
									✂ — — — — — — — — — — — — — — — — — — —
								</div>

								{sent ? (
									<p className="page-derby__sent" role="status">
										{t.sent}
									</p>
								) : (
									<form
										className="page-derby__form"
										onSubmit={handleSubmit}
										noValidate
									>
										<label className="page-derby__field">
											<span>{t.name}</span>
											<input
												name="name"
												type="text"
												required
												className="page-derby__input"
											/>
										</label>

										<fieldset className="page-derby__fieldset">
											<legend className="page-derby__legend">
												{t.interests}
											</legend>
											<div className="page-derby__checkboxes">
												{interests.map((item) => (
													<label
														key={item}
														className="page-derby__checkbox-label"
													>
														<input
															type="checkbox"
															checked={checked.includes(item)}
															onChange={() => toggleInterest(item)}
															className="page-derby__checkbox"
														/>
														<span>{item}</span>
													</label>
												))}
											</div>
										</fieldset>

										<label className="page-derby__field">
											<span>{t.email}</span>
											<input
												name="email"
												type="email"
												required
												className="page-derby__input"
											/>
										</label>

										<label className="page-derby__field">
											<span>{t.message}</span>
											<textarea
												name="message"
												rows={3}
												className="page-derby__input page-derby__input--textarea"
											/>
										</label>

										<button type="submit" className="page-derby__submit">
											{t.send}
										</button>
									</form>
								)}

								<div
									className="page-derby__scissors page-derby__scissors--bottom"
									aria-hidden
								>
									— — — — — — — — — — — — — — — — — — — ✂
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
