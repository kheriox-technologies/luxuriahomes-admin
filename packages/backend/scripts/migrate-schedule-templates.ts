import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { internal } from '../convex/_generated/api.js';

// Load .env.local manually (dotenv not installed in backend package)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
try {
	const envContent = readFileSync(envPath, 'utf-8');
	for (const line of envContent.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) {
			continue;
		}
		const eqIdx = trimmed.indexOf('=');
		if (eqIdx === -1) {
			continue;
		}
		const key = trimmed.slice(0, eqIdx).trim();
		const val = trimmed
			.slice(eqIdx + 1)
			.split('#')[0]
			.trim();
		if (key && !(key in process.env)) {
			process.env[key] = val;
		}
	}
} catch {
	// .env.local not found — rely on env vars already set
}

const DEV_URL = process.env.CONVEX_URL;
const PROD_URL = process.env.PROD_CONVEX_URL;
const DEV_ADMIN_KEY = process.env.DEV_CONVEX_ADMIN_KEY;
const PROD_ADMIN_KEY = process.env.PROD_CONVEX_ADMIN_KEY;
const DRY_RUN = process.env.DRY_RUN !== 'false';

function requireEnv(name: string, value: string | undefined): string {
	if (!value) {
		throw new Error(`Missing required env var: ${name}`);
	}
	return value;
}

const devUrl = requireEnv('CONVEX_URL', DEV_URL);
const prodUrl = requireEnv('PROD_CONVEX_URL', PROD_URL);
const devAdminKey = requireEnv('DEV_CONVEX_ADMIN_KEY', DEV_ADMIN_KEY);
const prodAdminKey = requireEnv('PROD_CONVEX_ADMIN_KEY', PROD_ADMIN_KEY);

const devClient = new ConvexHttpClient(devUrl);
// biome-ignore lint/suspicious/noExplicitAny: setAdminAuth is internal API
(devClient as any).setAdminAuth(devAdminKey);

const prodClient = new ConvexHttpClient(prodUrl);
// biome-ignore lint/suspicious/noExplicitAny: setAdminAuth is internal API
(prodClient as any).setAdminAuth(prodAdminKey);

async function main() {
	console.log(
		`Mode: ${DRY_RUN ? 'DRY RUN (pass DRY_RUN=false to write to prod)' : 'LIVE — writing to prod'}`
	);
	console.log(`Dev:  ${devUrl}`);
	console.log(`Prod: ${prodUrl}\n`);

	const templates = await devClient.query(
		internal.migration.exportScheduleTemplates.exportScheduleTemplates,
		{}
	);
	console.log(`Found ${templates.length} template(s) in dev\n`);

	for (const template of templates) {
		console.log(
			`Template: "${template.name}" — ${template.stages.length} stages, ${template.tasks.length} tasks`
		);

		if (DRY_RUN) {
			for (const stage of template.stages.sort((a, b) => a.order - b.order)) {
				console.log(`  Stage: "${stage.name}" (order ${stage.order})`);
				const stageTasks = template.tasks
					.filter((t) => t.devStageId === stage.devId)
					.sort((a, b) => a.order - b.order);
				for (const task of stageTasks) {
					console.log(`    Task: "${task.name}" (${task.durationDays}d)`);
				}
			}
			console.log('  [DRY RUN] Would create template in prod\n');
			continue;
		}

		const prodTemplateId = await prodClient.mutation(
			internal.migration.importScheduleTemplate.importScheduleTemplate,
			{
				name: template.name,
				description: template.description,
				stages: template.stages,
				tasks: template.tasks,
			}
		);
		console.log(`  Created → ${prodTemplateId}\n`);
	}

	console.log('Migration complete.');
}

main().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
