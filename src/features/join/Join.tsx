import { useState } from "react";
import type { ClubPage } from "../../../sanity/sanity.types";
import type { Locale } from "@i18n/index";
import { useTranslations } from "@i18n/index";
import ContactForm from "@components/contactForm/ContactForm";
import SignupBlock from "@components/signupBlock/SignupBlock";
import RoleCard from "./roleCard/RoleCard";
import type { JoinContent, JoinRoleId } from "./joinContent";
import { useRoleVideos } from "./useRoleVideos";
import "./join.css";

interface JoinProps {
	data: ClubPage;
	locale: Locale;
	content: JoinContent;
}

export default function Join({ data, locale, content }: JoinProps) {
	const t = useTranslations(locale).join;
	const [role, setRole] = useState<JoinRoleId | null>(null);
	const { sectionRef, toggleVideo } = useRoleVideos(content.roles);
	const preset = role
		? {
				interest: role,
				message:
					content.roles.find((profile) => profile.id === role)?.message ?? "",
			}
		: undefined;

	return (
		<div className="join">
			<section ref={sectionRef} className="roles" aria-label={t.rolesLabel}>
				<ul>
					{content.roles.map((copy) => {
						const { id, video, poster } = copy;
						return (
							<li key={id}>
								<RoleCard
									id={id}
									title={copy.title}
									lead={copy.lead}
									text={copy.text}
									tags={copy.tags}
									cta={copy.cta}
									videoSoon={t.videoSoon}
									video={video}
									poster={poster}
									playLabel={t.playVideo}
									pauseLabel={t.pauseVideo}
									onVideoToggle={() => toggleVideo(id)}
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
