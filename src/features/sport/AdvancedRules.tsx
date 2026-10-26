import type { Locale } from "@i18n/index";
import type { Notion } from "./types";

interface AdvancedRulesProps {
	rules: Notion[];
	locale: Locale;
}

const AdvancedRules = ({ rules, locale }: AdvancedRulesProps) => (
	<section id="advanced-rules" className="advanced-rules section">
		<div className="section__inner">
			<header className="section__header section__header--narrow">
				<span className="section__eyebrow">Pour aller plus loin</span>

				<h2 className="section__title">
					Les règles <br /> du jeu
				</h2>

				<p className="section__intro">
					Une fois les bases acquises, quelques notions permettent de mieux
					comprendre les stratégies, les pénalités et les décisions arbitrales.
				</p>
			</header>

			<div className="advanced-rules__grid">
				{rules.map((rule) => (
					<article key={rule.id} className="rule-card">
						<span>{rule.number}</span>
						<h3>{rule.title[locale]}</h3>
						<p>{rule.detail[locale]}</p>
					</article>
				))}
			</div>
		</div>
	</section>
);

export default AdvancedRules;
