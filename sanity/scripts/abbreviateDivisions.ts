/**
 * Abbreviates "Nationale 1/2" (and EN "National 1/2") to "N1/N2" in competition names and events.
 * Dry run by default: `./node_modules/.bin/sanity exec scripts/abbreviateDivisions.ts --with-user-token`
 * Write to the dataset: append `-- --apply` (call the binary directly, yarn swallows the `--`)
 */
import { getCliClient } from "sanity/cli";

interface LocalizedName {
	fr?: string;
	en?: string;
}

interface CompetitionDoc {
	_id: string;
	competition?: LocalizedName;
	event?: LocalizedName;
}

const FIELDS = ["competition", "event"] as const;
const LOCALES = ["fr", "en"] as const;
const DIVISION_PATTERN = /\bNationale? ([12])\b/g;

const client = getCliClient({ apiVersion: "2025-01-01" });
const apply = process.argv.includes("--apply");

// sanity exec bundles to CJS: no top-level await
async function run(): Promise<void> {
	const docs = await client.fetch<CompetitionDoc[]>(
		`*[_type == "competition"]{_id, competition, event}`,
	);

	const transaction = client.transaction();
	let changes = 0;

	for (const doc of docs) {
		const set: Record<string, string> = {};
		for (const field of FIELDS) {
			for (const locale of LOCALES) {
				const value = doc[field]?.[locale];
				if (!value) continue;
				const next = value.replace(DIVISION_PATTERN, "N$1");
				if (next === value) continue;
				set[`${field}.${locale}`] = next;
				console.log(`${doc._id}  ${field}.${locale}: "${value}" → "${next}"`);
			}
		}
		if (Object.keys(set).length > 0) {
			transaction.patch(doc._id, { set });
			changes++;
		}
	}

	if (changes === 0) {
		console.log("Nothing to change.");
	} else if (apply) {
		await transaction.commit();
		console.log(`Updated ${changes} document(s).`);
	} else {
		console.log(`Dry run: ${changes} document(s) would be updated. Re-run with -- --apply to write.`);
	}
}

run().catch((error: Error) => {
	console.error(error.message);
	process.exit(1);
});
