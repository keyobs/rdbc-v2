import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import type { Translations } from "@i18n/index";
import MobileNavDrawer from "./MobileNavDrawer";
import { withBase } from "@utils/urlHandler";
import "./bottomNav.css";
import { getLocale, getLocalizedHref } from "@i18n/routes";

interface BottomNavProps {
	t: Translations["nav"];
	pathname: string;
	logoSrc: string;
}

const BOTTOM_NAV_ITEMS = [
	{ key: "home" as const, href: "/" },
	{ key: "club" as const, href: "/club" },
	{ key: "events" as const, href: "/news" },
	{ key: "contact" as const, href: "/club#contact" },
] as const;

const isActive = (pathname: string, href: string): boolean =>
	href === "/"
		? pathname === "/"
		: pathname === href || pathname.startsWith(`${href}/`);

const BottomNav = ({ t, pathname, logoSrc }: BottomNavProps) => {
	const [open, setOpen] = useState(false);
	const locale = getLocale(pathname);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<nav className="bottom-nav" aria-label="Primary navigation">
				<ul className="bottom-nav__items">
					{BOTTOM_NAV_ITEMS.slice(0, 2).map((item) => (
						<li key={item.href} className="bottom-nav__item">
							<a
								href={withBase(getLocalizedHref(item.href, locale))}
								aria-label={item.key === "home" ? t.homeLabel : undefined}
								aria-current={
									isActive(pathname, getLocalizedHref(item.href, locale))
										? "page"
										: undefined
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
								href={withBase(getLocalizedHref(item.href, locale))}
								aria-label={item.key === "home" ? t.homeLabel : undefined}
								aria-current={
									isActive(pathname, getLocalizedHref(item.href, locale))
										? "page"
										: undefined
								}
							>
								{t[item.key]}
							</a>
						</li>
					))}
				</ul>

				{/* Border bump hugging the logo ring (logo 52px + 16px gap = r42).
				    The fill runs 4px past the bar border so no sliver shows through on fractional pixel ratios */}
				<svg
					className="bottom-nav__notch"
					width="140"
					height="16"
					viewBox="0 0 140 16"
					aria-hidden="true"
					focusable="false"
				>
					<path
						className="bottom-nav__notch-fill"
						d="M0 11 L65.06 3.29 A42 42 0 0 1 74.94 3.29 L140 11 V16 H0 Z"
					/>
					<path
						className="bottom-nav__notch-stroke"
						d="M0 11 L65.06 3.29 A42 42 0 0 1 74.94 3.29 L140 11"
					/>
				</svg>
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
