import type { Translations } from "@i18n/index";
import { NAV_LINKS } from "./navLinks";
import "./navbar.css";

interface NavbarProps {
	t: Translations["nav"];
}

export default function Navbar({ t }: NavbarProps) {
	return (
		<nav className="navbar" aria-label="Main navigation">
			<ul className="navbar__links">
				{NAV_LINKS.map((link) => (
					<li key={link.href}>
						<a href={link.href}>{t[link.key]}</a>
					</li>
				))}
				<li>
					<a href="/rejoindre" className="navbar__cta">
						{t.join}
					</a>
				</li>
			</ul>
		</nav>
	);
}
