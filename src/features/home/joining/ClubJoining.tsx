import "./clubJoining.css";

import type { CSSProperties } from "react";

export interface JoiningPosition {
	id: string;
	title: string;
	description: string;
	icon?: string;
}

interface ClubJoiningProps {
	positions: JoiningPosition[];
}

const ClubJoining = ({ positions }: ClubJoiningProps) => {
	if (positions.length === 0) return null;

	return (
		<section className="club-joining">
			<div className="positions-container">
				<div className="positions-grid">
					{positions.map((position, index) => (
						<div
							key={position.id}
							className="position-item"
							style={{ "--position-delay": `${index * 80}ms` } as CSSProperties}
						>
							<div className="position-card">
								<div className="icon-box">
									<span className="placeholder-icon">{position.icon}</span>
								</div>
								<div className="content-box">
									<h3 className="heading">{position.title}</h3>
									<p className="description">{position.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ClubJoining;
