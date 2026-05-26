import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import type { Translations } from "@i18n/index";
import FacebookLink from "@components/social/FacebookLink";
import InstagramLink from "@components/social/InstagramLink";
import { NAV_LINKS } from "../navLinks";
import "./mobileNavDrawer.css";

interface MobileNavDrawerProps {
	t: Translations["nav"];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const MobileNavDrawer = ({ t, open, onOpenChange }: MobileNavDrawerProps) => {
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
											<a href={link.href} onClick={() => onOpenChange(false)}>
												{t[link.key]}
											</a>
										</li>
									))}
								</ul>
							</nav>

							<a
								href="/rejoindre"
								className="mobile-nav-drawer__cta"
								onClick={() => onOpenChange(false)}
							>
								{t.join}
							</a>

							<div className="mobile-nav-drawer__social">
								<InstagramLink size={28} />
								<FacebookLink size={28} />
							</div>
						</motion.div>
					</Dialog.Content>
				</Dialog.Portal>
			)}
		</AnimatePresence>
	);
};

export default MobileNavDrawer;
