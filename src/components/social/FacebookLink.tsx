import { FacebookLogoIcon } from "@phosphor-icons/react";
import "./socialLink.css";

interface FacebookLinkProps {
	size?: number;
}

const FacebookLink = ({ size = 24 }: FacebookLinkProps) => (
	<a
		href="https://www.facebook.com/PLACEHOLDER"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Facebook"
		className="social-link"
	>
		<FacebookLogoIcon size={size} weight="bold" />
	</a>
);

export default FacebookLink;
