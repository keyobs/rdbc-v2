import { useState } from "react";
import { motion } from "framer-motion";
import type { ClubPage } from "../../../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import { withBase } from "@utils/urlHandler";
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

const DEFAULT_SIGNUP_NEW_URL =
	"https://docs.google.com/forms/d/e/1FAIpQLSfnGYZKQUpzsBz1UicyDkR8bcP6E4r0Pr4U7cpWFuuF9Do5NQ/viewform?usp=header";
const DEFAULT_SIGNUP_RENEW_URL =
	"https://docs.google.com/forms/d/e/1FAIpQLSf0YopUzxKK9UtBg4msRd3yKTX8wt-ZxdCIRoEqyvjnLhPR0w/viewform?usp=header";
const DEFAULT_HELLOASSO_URL =
	"https://www.helloasso.com/associations/roller-derby-bordeaux-club";

const DEFAULT_JOIN_INFO = {
	fr: "L'arrivée dans le club est possible toute l'année.\nDébutant·e, expérimenté·e, vétéran·e, revenant·e, le club vous est ouvert à toustes.",
	en: "You can join the club at any time of the year.\nBeginner, experienced, veteran or coming back: the club is open to everyone.",
};

const DEFAULT_FEES = { base: 150, competition: 180, solidarity: 120 };

const LABELS = {
	fr: {
		pageTitle: "Faire du roller derby",
		trainingTitle: "Planning d'entraînement",
		signupTitle: "S'inscrire",
		fillForm: "Remplir le formulaire",
		newMember: "Nouvelle inscription",
		renewal: "Réinscription",
		or: "ou",
		feesTitle: "Tarifs adhésion",
		feeBase: "Socle",
		feeCompetition: "Compétition",
		feeSolidarity: "Solidaire",
		payLine1: "Payer sur",
		payLine2: "HelloAsso",
		formTitle: "Nous contacter",
		name: "Prénom",
		interests: "Je suis intéressé·e par",
		email: "Email",
		message: "Message",
		send: "Envoyer",
		sending: "Envoi en cours…",
		sent: "Message envoyé — à très vite !",
		error: "L'envoi a échoué. Réessaie ou écris-nous à",
		openMaps: "Voir sur Maps",
	},
	en: {
		pageTitle: "Play roller derby",
		trainingTitle: "Training schedule",
		signupTitle: "Sign up",
		fillForm: "Fill in the form",
		newMember: "New registration",
		renewal: "Re-registration",
		or: "or",
		feesTitle: "Membership fees",
		feeBase: "Base",
		feeCompetition: "Competition",
		feeSolidarity: "Solidarity",
		payLine1: "Pay on",
		payLine2: "HelloAsso",
		formTitle: "Contact us",
		name: "First name",
		interests: "I'm interested in",
		email: "Email",
		message: "Message",
		send: "Send",
		sending: "Sending…",
		sent: "Message sent — see you soon!",
		error: "Sending failed. Try again or write to us at",
		openMaps: "View on Maps",
	},
};

const CONTACT_EMAIL = "intraligue@rollerderbybordeaux.fr";

type SubmitStatus = "idle" | "sending" | "sent" | "error";

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
	const signupNewUrl = data.signup_new_url ?? DEFAULT_SIGNUP_NEW_URL;
	const signupRenewUrl = data.signup_renew_url ?? DEFAULT_SIGNUP_RENEW_URL;
	const helloAssoUrl = data.inscription_url ?? DEFAULT_HELLOASSO_URL;
	const joinInfo = data.join_info?.[locale] ?? DEFAULT_JOIN_INFO[locale];
	const [joinLead, ...joinRest] = joinInfo
		.split("\n")
		.filter((line) => line.trim() !== "");
	const fees = [
		{ label: t.feeBase, price: data.fee_base ?? DEFAULT_FEES.base },
		{
			label: t.feeCompetition,
			price: data.fee_competition ?? DEFAULT_FEES.competition,
		},
		{
			label: t.feeSolidarity,
			price: data.fee_solidarity ?? DEFAULT_FEES.solidarity,
		},
	];
	const interests = locale === "fr" ? INTERESTS_FR : INTERESTS_EN;

	const [status, setStatus] = useState<SubmitStatus>("idle");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const body = new FormData(form);
		body.append("locale", locale);
		setStatus("sending");
		try {
			const response = await fetch(withBase("/send.php"), {
				method: "POST",
				body,
			});
			if (!response.ok) throw new Error(`send.php answered ${response.status}`);
			setStatus("sent");
			form.reset();
		} catch {
			setStatus("error");
		}
	}

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
								{sessions.map((session) => (
									<div key={session._key} className="row">
										{DAYS_ORDER.map((day) => {
											const active = session.days?.includes(day);
											return (
												<div
													key={day}
													className={active ? "cell active" : "cell"}
												>
													{active && (
														<>
															<span className="time">{session.time_start}</span>
															<span className="label">
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
							<div className="maps-links">
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
										>
											{t.openMaps} —{" "}
											{sessions.find(
												(s) => (s.maps_query ?? s.location_name) === query,
											)?.location_name ?? query}
										</a>
									))}
							</div>
						</motion.div>

						<motion.div
							className="signup"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-40px" }}
						>
							<h3 className="section-title">{t.signupTitle}</h3>
							<p className="lead">{joinLead}</p>
							{joinRest.map((line) => (
								<p key={line}>{line}</p>
							))}

							<h4 className="label">{t.fillForm}</h4>
							<div className="forms">
								<a
									className="btn"
									href={signupNewUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									{t.newMember}
								</a>
								<span>{t.or}</span>
								<a
									className="btn"
									href={signupRenewUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									{t.renewal}
								</a>
							</div>

							<h4 className="label">{t.feesTitle}</h4>
							<div className="fees">
								<ul>
									{fees.map((fee) => (
										<li key={fee.label}>
											<span>{fee.label}</span>
											<b>{fee.price} €</b>
										</li>
									))}
								</ul>
								<a
									className="btn pay"
									href={helloAssoUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span>{t.payLine1}</span>
									<span>{t.payLine2}</span>
								</a>
							</div>
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
							<h3 className="section-title">{t.formTitle}</h3>
							<div className="coupon">
								<div className="scissors" aria-hidden>
									✂ — — — — — — — — — — — — — — — — — — —
								</div>

								{status === "sent" ? (
									<p className="feedback" role="status">
										{t.sent}
									</p>
								) : (
									<form className="form" onSubmit={handleSubmit}>
										{/* Honeypot: real visitors never see nor fill it */}
										<input
											className="honeypot"
											name="website"
											type="text"
											tabIndex={-1}
											autoComplete="off"
											aria-hidden
										/>

										<label className="field">
											<span>{t.name}</span>
											<input name="name" type="text" required maxLength={80} />
										</label>

										<fieldset>
											<legend>{t.interests}</legend>
											<div className="checkboxes">
												{interests.map((item) => (
													<label key={item} className="checkbox">
														<input
															type="checkbox"
															name="interests[]"
															value={item}
														/>
														<span>{item}</span>
													</label>
												))}
											</div>
										</fieldset>

										<label className="field">
											<span>{t.email}</span>
											<input
												name="email"
												type="email"
												required
												maxLength={120}
											/>
										</label>

										<label className="field">
											<span>{t.message}</span>
											<textarea
												name="message"
												rows={3}
												required
												maxLength={2000}
											/>
										</label>

										<div className="actions">
											<button type="submit" disabled={status === "sending"}>
												{status === "sending" ? t.sending : t.send}
											</button>
											{status === "error" && (
												<p className="feedback error" role="alert">
													{t.error}{" "}
													<a href={`mailto:${CONTACT_EMAIL}`}>
														{CONTACT_EMAIL}
													</a>
												</p>
											)}
										</div>
									</form>
								)}

								<div className="scissors bottom" aria-hidden>
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
