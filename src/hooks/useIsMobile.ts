import { useState, useEffect } from "react";
import { breakpoints } from "@constants/breakpoints";

const QUERY = `(max-width: ${breakpoints.medium - 1}px)`;

const useIsMobile = (): boolean | undefined => {
	const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		const mql = window.matchMedia(QUERY);
		setIsMobile(mql.matches);

		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	return isMobile;
};

export default useIsMobile;
