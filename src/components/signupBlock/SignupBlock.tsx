import type { ClubPage } from "../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import "../buttons/ctaAlt.css";
import "./signupBlock.css";

type SignupData = Pick<
	ClubPage,
	| "signup_new_url"
	| "signup_renew_url"
	| "inscription_url"
	| "join_info"
	| "fee_base"
	| "fee_competition"
	| "fee_solidarity"
>;

interface SignupBlockProps {
	data: SignupData;
	locale: Locale;
	headingLevel?: 2 | 3;
}

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
	},
	en: {
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
	},
};

export default function SignupBlock({
	data,
	locale,
	headingLevel = 3,
}: SignupBlockProps) {
	const t = LABELS[locale];
	const Heading = headingLevel === 2 ? "h2" : "h3";
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

	return (
		<div className="signup-block">
			<Heading className="title">{t.signupTitle}</Heading>
			<p className="lead">{joinLead}</p>
			{joinRest.map((line) => (
				<p key={line}>{line}</p>
			))}

			<p className="label">{t.fillForm}</p>
			<div className="forms">
				<a
					className="cta-alt"
					href={signupNewUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{t.newMember}
				</a>
				<span>{t.or}</span>
				<a
					className="cta-alt tilt-right"
					href={signupRenewUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{t.renewal}
				</a>
			</div>

			<p className="label">{t.feesTitle}</p>
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
					className="cta-alt burst"
					href={helloAssoUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					<span>{t.payLine1}</span>
					<span>{t.payLine2}</span>
				</a>
			</div>
		</div>
	);
}
