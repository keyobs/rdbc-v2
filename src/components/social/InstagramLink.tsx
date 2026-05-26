import { InstagramLogoIcon } from "@phosphor-icons/react";

interface InstagramLinkProps {
	size?: number;
}

const InstagramLink = ({ size = 24 }: InstagramLinkProps) => (
	<a
		href="https://www.instagram.com/PLACEHOLDER"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Instagram"
		className="social-link"
	>
		<InstagramLogoIcon size={size} weight="bold" />
	</a>
);

export default InstagramLink;
