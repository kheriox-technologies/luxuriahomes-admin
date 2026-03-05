import { execSync } from 'node:child_process';
import { appConfig } from './config';

const BACKEND_URL_LINE = /Backend URL:\s*(.+)/;
const TRAILING_SLASH = /\/$/;

function normalizeUrl(url: string): string {
	return url.trim().replace(TRAILING_SLASH, '');
}

/**
 * Gets the current Pulumi backend URL by running `pulumi whoami -v` and parsing the output.
 * Same as the backend shown by `pulumi whoami` in the terminal.
 */
function getCurrentBackendUrl(): string {
	const out = execSync('pulumi whoami -v', {
		encoding: 'utf-8',
		cwd: process.cwd(),
	});
	const match = out.match(BACKEND_URL_LINE);
	if (!match) {
		throw new Error(
			'Could not determine current Pulumi backend URL from "pulumi whoami -v" output.'
		);
	}
	return normalizeUrl(match[1].trim());
}

/**
 * Ensures the current Pulumi backend (from `pulumi whoami`) matches the backend URL
 * configured for this stack in Pulumi.<stack>.yaml (app:pulumiBackendUrl).
 * Call this before creating any resources to avoid deploying state to the wrong backend.
 */
export function requireMatchingBackendUrl(): void {
	const configuredUrl = appConfig.get('pulumiBackendUrl');
	if (!configuredUrl) {
		throw new Error(
			'app:pulumiBackendUrl is not set in this stack config. Add it to Pulumi.<stack>.yaml to enforce backend checks.'
		);
	}

	const currentUrl = getCurrentBackendUrl();
	const normalizedConfigured = normalizeUrl(configuredUrl);

	if (currentUrl !== normalizedConfigured) {
		throw new Error(
			`Pulumi backend URL mismatch. Current backend (from "pulumi whoami") is "${currentUrl}" but this stack expects "${normalizedConfigured}" (app:pulumiBackendUrl). Log in to the correct backend (e.g. "pulumi login ${normalizedConfigured}") or fix the stack config.`
		);
	}
}
