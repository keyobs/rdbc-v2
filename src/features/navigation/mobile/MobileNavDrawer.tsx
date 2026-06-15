import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import type { Translations } from "@i18n/index";
import { isEnglish, getAlternateHref } from "@i18n/routes";
import FacebookLink from "@components/social/FacebookLink";
import InstagramLink from "@components/social/InstagramLink";
import ShinyButton from "@components/buttons/ShinyButton";
import { NAV_LINKS } from "../navLinks";
import { withBase } from "@utils/urlHandler";
import "./mobileNavDrawer.css";

interface MobileNavDrawerProps {
	t: Translations["nav"];
	pathname: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const MobileNavDrawer = ({
	t,
	pathname,
	open,
	onOpenChange,
}: MobileNavDrawerProps) => {
	const isEN = isEnglish(pathname);
	const altHref = getAlternateHref(pathname);
	const frHref = isEN ? altHref : pathname;
	const enHref = isEN ? pathname : altHref;

	return (
		<AnimatePresence>
			{open && (
				<Dialog.Portal forceMount>
					<Dialog.Overlay asChild>
						<motion.div
							className="mobile-nav-overlay"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						/>
					</Dialog.Overlay>

					<Dialog.Content asChild>
						<motion.div
							id="mobile-nav-content"
							className="mobile-nav-drawer"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={{ type: "spring", damping: 32, stiffness: 320 }}
						>
							<div className="mobile-nav-drawer__header">
								<Dialog.Title className="mobile-nav-drawer__title">
									RDBC
								</Dialog.Title>
								<Dialog.Close asChild>
									<button
										type="button"
										className="mobile-nav-drawer__close"
										aria-label="Close navigation menu"
									>
										<XIcon size={24} weight="bold" />
									</button>
								</Dialog.Close>
							</div>

							<Dialog.Description className="sr-only">
								Main site navigation
							</Dialog.Description>

							<nav aria-label="Mobile navigation">
								<ul className="mobile-nav-drawer__links">
									{NAV_LINKS.map((link) => (
										<li key={link.href}>
											<a
												href={withBase(link.href)}
												onClick={() => onOpenChange(false)}
											>
												{t[link.key]}
											</a>
										</li>
									))}
								</ul>
							</nav>

							<ShinyButton
								href={withBase("/rejoindre")}
								onClick={() => onOpenChange(false)}
							>
								{t.join}
							</ShinyButton>

							<div className="mobile-nav-drawer__social">
								<InstagramLink size={28} />
								<FacebookLink size={28} />
							</div>

							<div className="mobile-nav-drawer__lang">
								{isEN ? (
									<a
										href={withBase(frHref)}
										className="mobile-nav-drawer__lang-btn"
										hrefLang="fr"
									>
										FR
									</a>
								) : (
									<span
										className="mobile-nav-drawer__lang-btn mobile-nav-drawer__lang-btn--active"
										aria-current="true"
									>
										FR
									</span>
								)}
								<span aria-hidden="true">/</span>
								{isEN ? (
									<span
										className="mobile-nav-drawer__lang-btn mobile-nav-drawer__lang-btn--active"
										aria-current="true"
									>
										EN
									</span>
								) : (
									<a
										href={withBase(enHref)}
										className="mobile-nav-drawer__lang-btn"
										hrefLang="en"
									>
										EN
									</a>
								)}
							</div>
						</motion.div>
					</Dialog.Content>
				</Dialog.Portal>
			)}
		</AnimatePresence>
	);
};

export default MobileNavDrawer;
