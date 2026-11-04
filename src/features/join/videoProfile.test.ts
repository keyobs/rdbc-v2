import assert from "node:assert/strict";
import { test } from "node:test";
import {
	parseVideoInfo,
	assertSource,
	assertOptimized,
	encodingArgs,
	MAX_VIDEO_BYTES,
	videoDate,
	VIDEO_PRESETS,
} from "../../../sanity/video/videoProfile.ts";

const probe = (duration: string, audio = true) =>
	JSON.stringify({
		format: { duration, tags: { creation_time: "2024-05-20T12:00:00Z" } },
		streams: [
			{
				codec_type: "video",
				codec_name: "h264",
				width: 1920,
				height: 1080,
				sample_aspect_ratio: "1:1",
			},
			...(audio ? [{ codec_type: "audio" }] : []),
		],
	});

test("duration is strictly limited to 30 seconds and unknown media is rejected", () => {
	assert.doesNotThrow(() => assertSource(parseVideoInfo(probe("30")), 1000));
	assert.throws(
		() => assertSource(parseVideoInfo(probe("30.01")), 1000),
		/30 secondes/,
	);
	assert.throws(() => parseVideoInfo("{}"), /illisible/);
});
test("encoding removes audio and fits aspect ratio without upscaling", () => {
	const args = encodingArgs(
		parseVideoInfo(probe("10")),
		"source",
		"output.mp4",
	);
	assert.ok(args.includes("-an"));
	assert.ok(args.includes("scale=400:224,setsar=1"));
	const small = { ...parseVideoInfo(probe("10")), width: 320, height: 241 };
	assert.ok(
		encodingArgs(small, "source", "output", "max").includes(
			"scale=320:240,setsar=1",
		),
	);
});
test("three presets retain proportions and enforce their own size limits", () => {
	const source = parseVideoInfo(probe("10", false));
	for (const preset of ["mini", "reduce", "max"] as const) {
		const settings = VIDEO_PRESETS[preset];
		const args = encodingArgs(source, "source", "output", preset);
		const scale = args[args.indexOf("-vf") + 1].match(/scale=(\d+):(\d+)/);
		assert.ok(scale);
		const width = Number(scale[1]);
		const height = Number(scale[2]);
		assert.ok(width <= settings.dimension && height <= settings.dimension);
		assert.ok(Math.abs(width / height - 1920 / 1080) < 0.025);
		assert.doesNotThrow(() =>
			assertOptimized({ ...source, width, height }, 1000, preset),
		);
		assert.throws(() =>
			assertOptimized(
				{ ...source, width, height },
				settings.maxBytes + 1,
				preset,
			),
		);
	}
});
test("output is verified, including size, audio, codec and dimensions", () => {
	const good = {
		...parseVideoInfo(probe("10", false)),
		width: 400,
		height: 224,
	};
	assert.doesNotThrow(() => assertOptimized(good, 1000));
	for (const bad of [
		{ ...good, hasAudio: true },
		{ ...good, width: 402 },
		{ ...good, codec: "hevc" },
	])
		assert.throws(() => assertOptimized(bad, 1000));
	assert.throws(() => assertOptimized(good, MAX_VIDEO_BYTES + 1));
});
test("dates use editor override, then metadata, then upload", () => {
	assert.equal(
		videoDate("2023-03-02", "2024-05-20", "2026-11-02")?.date,
		"2023-03-02",
	);
	assert.equal(
		videoDate(undefined, "2024-05-20", "2026-11-02")?.origin,
		"Métadonnées",
	);
	assert.equal(
		videoDate(undefined, undefined, "2026-11-02T12:00:00Z")?.origin,
		"Date d’upload",
	);
	assert.equal(
		parseVideoInfo(probe("10")).capturedAt,
		"2024-05-20T12:00:00.000Z",
	);
});
