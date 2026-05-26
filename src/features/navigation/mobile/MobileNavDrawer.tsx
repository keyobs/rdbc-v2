import * as Dialog from "@radix-ui/react-dialog";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Translations } from "@i18n/index";
import { NAV_LINKS } from "../navLinks";
import "./mobileNavDrawer.css";

interface MobileNavDrawerProps {
	t: Translations["nav"];
}

const MobileNavDrawer = ({ t }: MobileNavDrawerProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="mobile-nav-trigger"
					aria-label={open ? "Close navigation menu" : "Open navigation menu"}
					aria-expanded={open}
					aria-controls="mobile-nav-content"
				>
					<ListIcon size={28} weight="bold" color="blue" />
				</button>
			</Dialog.Trigger>

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
												<a href={link.href} onClick={() => setOpen(false)}>
													{t[link.key]}
												</a>
											</li>
										))}
									</ul>
								</nav>

								<a
									href="/rejoindre"
									className="mobile-nav-drawer__cta"
									onClick={() => setOpen(false)}
								>
									{t.join}
								</a>
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
};

export default MobileNavDrawer;
