import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import type { Translations } from "@i18n/index";
import MobileNavDrawer from "./MobileNavDrawer";
import "./bottomNav.css";

interface BottomNavProps {
	t: Translations["nav"];
	pathname: string;
	logoSrc: string;
}

const BOTTOM_NAV_ITEMS = [
	{ key: "club" as const, href: "/club" },
	{ key: "rules" as const, href: "/regles" },
	{ key: "events" as const, href: "/evenements" },
	{ key: "contact" as const, href: "/contact" },
] as const;

const BottomNav = ({ t, pathname, logoSrc }: BottomNavProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<nav className="bottom-nav" aria-label="Primary navigation">
				<ul className="bottom-nav__items">
					{BOTTOM_NAV_ITEMS.slice(0, 2).map((item) => (
						<li key={item.href} className="bottom-nav__item">
							<a
								href={item.href}
								aria-current={
									pathname.startsWith(item.href) ? "page" : undefined
								}
							>
								{t[item.key]}
							</a>
						</li>
					))}

					<li className="bottom-nav__logo-slot">
						<Dialog.Trigger asChild>
							<button
								type="button"
								className="bottom-nav__logo-btn"
								aria-label="Open full navigation menu"
								aria-expanded={open}
							>
								<img src={logoSrc} alt="" width="52" height="52" />
							</button>
						</Dialog.Trigger>
					</li>

					{BOTTOM_NAV_ITEMS.slice(2).map((item) => (
						<li key={item.href} className="bottom-nav__item">
							<a
								href={item.href}
								aria-current={
									pathname.startsWith(item.href) ? "page" : undefined
								}
							>
								{t[item.key]}
							</a>
						</li>
					))}
				</ul>
			</nav>

			<MobileNavDrawer
				t={t}
				pathname={pathname}
				open={open}
				onOpenChange={setOpen}
			/>
		</Dialog.Root>
	);
};

export default BottomNav;
