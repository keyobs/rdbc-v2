import type { Translations } from "@i18n/index";
import { NAV_ITEMS } from "./navLinks";
import "./navbar.css";

interface NavbarProps {
	t: Translations["nav"];
}

const Navbar = ({ t }: NavbarProps) => {
	return (
		<nav className="navbar" aria-label="Main navigation">
			<ul className="navbar__links">
				{NAV_ITEMS.map((item) => {
					if (item.type === "separator") {
						return (
							<li key={item.id} aria-hidden="true">
								<span className="navbar__separator">|</span>
							</li>
						);
					}
					return (
						<li key={item.href}>
							<a href={item.href}>{t[item.key]}</a>
						</li>
					);
				})}
				<li>
					<a href="/rejoindre" className="navbar__cta">
						{t.join}
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
