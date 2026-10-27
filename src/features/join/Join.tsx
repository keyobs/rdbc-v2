import { useState } from "react";
import type { ClubPage } from "../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import { useTranslations } from "@i18n/index";
import ContactForm from "@components/contactForm/ContactForm";
import SignupBlock from "@components/signupBlock/SignupBlock";
import RoleCard from "./roleCard/RoleCard";
import type { RoleVideo } from "./roleCard/RoleCard";
import "./join.css";

type JoinRole = "play" | "referee" | "volunteer";

interface JoinProps {
	data: ClubPage;
	locale: Locale;
}

// Add `video: { src: "/join/<role>.mp4", poster: "/join/<role>.webp" }`
// once the 7s clips are dropped in public/join/
const ROLES: { id: JoinRole; video?: RoleVideo }[] = [
	{ id: "play" },
	{ id: "referee" },
	{ id: "volunteer" },
];

export default function Join({ data, locale }: JoinProps) {
	const t = useTranslations(locale).join;
	const [role, setRole] = useState<JoinRole | null>(null);
	const preset = role
		? {
				interest: role,
				message: t.message.replace("{role}", t.roles[role].verb),
			}
		: undefined;

	return (
		<div className="join">
			<section className="roles" aria-label={t.rolesLabel}>
				<ul>
					{ROLES.map(({ id, video }) => {
						const copy = t.roles[id];
						return (
							<li key={id}>
								<RoleCard
									id={id}
									title={copy.title}
									lead={copy.lead}
									text={copy.text}
									tags={[copy.tag1, copy.tag2]}
									cta={copy.cta}
									videoSoon={t.videoSoon}
									video={video}
									onPick={() => setRole(id)}
								/>
							</li>
						);
					})}
				</ul>
			</section>

			<section className="sheet" aria-label={t.sheetLabel}>
				<div className="paper">
					<div className="signup">
						<SignupBlock data={data} locale={locale} headingLevel={2} />
					</div>
					<div className="contact" id="contact">
						{/* New key = fresh form with the picked role's preset */}
						<ContactForm
							key={role ?? "none"}
							locale={locale}
							preset={preset}
							headingLevel={2}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
