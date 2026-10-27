import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Locale } from "@i18n/index";
import { withBase } from "@utils/urlHandler";
import "./contactForm.css";

export type ContactInterest =
	| "play"
	| "try"
	| "referee"
	| "watch"
	| "volunteer"
	| "hello";

export interface ContactPreset {
	interest: ContactInterest;
	message: string;
}

interface ContactFormProps {
	locale: Locale;
	headingLevel?: 2 | 3;
	// Initial values only: remount with a new `key` to apply another preset
	preset?: ContactPreset;
}

const INTERESTS: { id: ContactInterest; fr: string; en: string }[] = [
	{ id: "play", fr: "Jouer", en: "Play" },
	{ id: "try", fr: "Essayer", en: "Try it out" },
	{ id: "referee", fr: "Arbitrer", en: "Referee" },
	{ id: "watch", fr: "Venir voir", en: "Come watch" },
	{ id: "volunteer", fr: "Filer un coup de main", en: "Volunteer" },
	{ id: "hello", fr: "Dire bonjour", en: "Say hi" },
];

const LABELS = {
	fr: {
		formTitle: "Nous contacter",
		name: "Prénom",
		interests: "Je suis intéressé·e par",
		email: "Email",
		message: "Message",
		copy: "Recevoir une copie de mon message",
		send: "Envoyer",
		sending: "Envoi en cours…",
		sent: "Message envoyé — à très vite !",
		error: "L'envoi a échoué. Réessaie ou écris-nous à",
	},
	en: {
		formTitle: "Contact us",
		name: "First name",
		interests: "I'm interested in",
		email: "Email",
		message: "Message",
		copy: "Send me a copy of my message",
		send: "Send",
		sending: "Sending…",
		sent: "Message sent — see you soon!",
		error: "Sending failed. Try again or write to us at",
	},
};

const CONTACT_EMAIL = "intraligue@rollerderbybordeaux.fr";

type SubmitStatus = "idle" | "sending" | "sent" | "error";

export default function ContactForm({
	locale,
	headingLevel = 3,
	preset,
}: ContactFormProps) {
	const t = LABELS[locale];
	const Heading = headingLevel === 2 ? "h2" : "h3";
	const [status, setStatus] = useState<SubmitStatus>("idle");

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
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
		<div className="contact-form">
			<Heading className="title">{t.formTitle}</Heading>
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

						<fieldset>
							<legend>{t.interests}</legend>
							<div className="checkboxes">
								{INTERESTS.map((item) => (
									<label key={item.id} className="checkbox">
										<input
											type="checkbox"
											name="interests[]"
											value={item[locale]}
											defaultChecked={preset?.interest === item.id}
										/>
										<span>{item[locale]}</span>
									</label>
								))}
							</div>
						</fieldset>

						<label className="field">
							<span>{t.name}</span>
							<input name="name" type="text" required maxLength={80} />
						</label>

						<label className="field">
							<span>{t.email}</span>
							<input name="email" type="email" required maxLength={120} />
						</label>

						<label className="field">
							<span>{t.message}</span>
							<textarea
								name="message"
								rows={preset ? 5 : 3}
								required
								maxLength={2000}
								defaultValue={preset?.message}
							/>
						</label>

						<label className="checkbox copy">
							<input type="checkbox" name="copy" value="1" />
							<span>{t.copy}</span>
						</label>

						<div className="actions">
							<button type="submit" disabled={status === "sending"}>
								{status === "sending" ? t.sending : t.send}
							</button>
							{status === "error" && (
								<p className="feedback error" role="alert">
									{t.error}{" "}
									<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
								</p>
							)}
						</div>
					</form>
				)}

				<div className="scissors bottom" aria-hidden>
					— — — — — — — — — — — — — — — — — — — ✂
				</div>
			</div>
		</div>
	);
}
