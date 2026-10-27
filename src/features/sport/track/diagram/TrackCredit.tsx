import "./diagram.css";

interface TrackCreditProps {
	text: string;
	linkLabel: string;
	author: string;
}

const CREDIT_URL = "https://nurds.space/";

const TrackCredit = ({ text, linkLabel, author }: TrackCreditProps) => (
	<p className="credit">
		{text}{" "}
		<a href={CREDIT_URL} target="_blank" rel="noopener noreferrer">
			{linkLabel}
		</a>{" "}
		{author}
	</p>
);

export default TrackCredit;
