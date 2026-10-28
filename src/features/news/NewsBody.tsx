import {
	type InferComponents,
	PortableText,
	type PortableTextTypeComponentProps,
} from "@portabletext/react";
import { PlayIcon } from "@phosphor-icons/react/dist/csr/Play";
import { useMemo } from "react";
import type { Translations } from "@i18n/index";
import { urlFor } from "@utils/sanityImage";
import type { NewsBody as NewsBodyValue, NewsBodyMember } from "./types";

type PhotoValue = Extract<NewsBodyMember, { _type: "photo" }>;
type GalleryValue = Extract<NewsBodyMember, { _type: "gallery" }>;
type VideoValue = Extract<NewsBodyMember, { _type: "video" }>;

interface NewsBodyProps {
	value: NewsBodyValue;
	labels: Translations["news"];
}

// youtube.com/watch?v=ID, youtube.com/shorts/ID, youtu.be/ID
const getYouTubeId = (url: string): string | null =>
	url.match(
		/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
	)?.[1] ?? null;

const isExternal = (href: string): boolean => /^https?:\/\//.test(href);

const Photo = ({ value }: PortableTextTypeComponentProps<PhotoValue>) => {
	if (!value.asset) return null;
	const caption = [value.caption, value.credit].filter(Boolean).join(" · ");
	return (
		<figure className="photo">
			<img
				src={urlFor(value).width(1200).fit("max").auto("format").url()}
				alt={value.alt ?? ""}
				loading="lazy"
			/>
			{caption && <figcaption>{caption}</figcaption>}
		</figure>
	);
};

const Gallery = ({ value }: PortableTextTypeComponentProps<GalleryValue>) => (
	<figure className="gallery">
		<div className="grid">
			{(value.images ?? [])
				.filter((image) => image.asset)
				.map((image) => (
					<img
						key={image._key}
						src={urlFor(image)
							.width(600)
							.height(450)
							.fit("crop")
							.auto("format")
							.url()}
						alt={image.alt ?? ""}
						width={600}
						height={450}
						loading="lazy"
					/>
				))}
		</div>
		{value.credit && <figcaption>{value.credit}</figcaption>}
	</figure>
);

// Built once per labels object: components recreated on each render would remount the iframes
const createComponents = (labels: Translations["news"]) => {
	const Video = ({
		value: video,
	}: PortableTextTypeComponentProps<VideoValue>) => {
		if (!video.url) return null;
		const youTubeId = getYouTubeId(video.url);

		// Other platforms (Instagram…) need their own scripts: a plain link is enough
		if (!youTubeId) {
			return (
				<a
					className="video-link"
					href={video.url}
					target="_blank"
					rel="noopener noreferrer"
				>
					<PlayIcon weight="bold" aria-hidden="true" />
					{video.caption ?? labels.watchVideo}
					<span className="sr-only"> {labels.newTab}</span>
				</a>
			);
		}

		return (
			<figure className="video">
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
					title={video.caption ?? labels.watchVideo}
					loading="lazy"
					allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
				{video.caption && <figcaption>{video.caption}</figcaption>}
			</figure>
		);
	};

	return {
		types: { photo: Photo, gallery: Gallery, video: Video },
		block: {
			h3: ({ children }) => <h4 className="subtitle">{children}</h4>,
		},
		marks: {
			link: ({ value: link, children }) => {
				const href = link?.href;
				if (!href) return <>{children}</>;
				return isExternal(href) ? (
					<a href={href} target="_blank" rel="noopener noreferrer">
						{children}
						<span className="sr-only"> {labels.newTab}</span>
					</a>
				) : (
					<a href={href}>{children}</a>
				);
			},
		},
	} satisfies InferComponents<NewsBodyValue>;
};

const NewsBody = ({ value, labels }: NewsBodyProps) => {
	const components = useMemo(() => createComponents(labels), [labels]);

	return (
		<div className="body">
			<PortableText value={value} components={components} />
		</div>
	);
};

export default NewsBody;
