// HTTP client for the Convex gmail-addon endpoints. Reads API_URL and
// API_KEY from Script Properties (set them in the Apps Script editor under
// Project Settings > Script Properties).

function api_(path, options) {
	const props = PropertiesService.getScriptProperties();
	const apiUrl = props.getProperty('API_URL');
	const apiKey = props.getProperty('API_KEY');
	if (!(apiUrl && apiKey)) {
		throw new Error('API_URL and API_KEY Script Properties are not set');
	}

	const params = {
		method: options?.method || 'get',
		headers: { Authorization: `Bearer ${apiKey}` },
		muteHttpExceptions: true,
	};
	if (options?.payload) {
		params.contentType = 'application/json';
		params.payload = JSON.stringify(options.payload);
	}

	const response = UrlFetchApp.fetch(apiUrl + path, params);
	const code = response.getResponseCode();
	const text = response.getContentText();
	let body = {};
	try {
		body = JSON.parse(text);
	} catch (_error) {
		// Non-JSON response body; fall through to the status check below.
	}
	if (code !== 200) {
		throw new Error(body.error || `Request failed (${code})`);
	}
	return body;
}

function fetchProjects_() {
	const cache = CacheService.getScriptCache();
	const cached = cache.get('projects');
	if (cached) {
		return JSON.parse(cached);
	}
	const { projects } = api_('/gmail-addon/projects');
	cache.put('projects', JSON.stringify(projects), 300);
	return projects;
}

function fetchFolders_(projectId) {
	return api_(
		`/gmail-addon/folders?projectId=${encodeURIComponent(projectId)}`
	);
}

function prepareUpload_(payload) {
	return api_('/gmail-addon/prepare-upload', { method: 'post', payload });
}

function completeUpload_(payload) {
	return api_('/gmail-addon/complete-upload', { method: 'post', payload });
}

function fetchTrades_() {
	const cache = CacheService.getScriptCache();
	const cached = cache.get('trades');
	if (cached) {
		return JSON.parse(cached);
	}
	const { trades } = api_('/gmail-addon/trades');
	cache.put('trades', JSON.stringify(trades), 300);
	return trades;
}

function fetchServiceProviders_(tradeId) {
	const { serviceProviders } = api_(
		`/gmail-addon/service-providers?tradeId=${encodeURIComponent(tradeId)}`
	);
	return serviceProviders;
}

function prepareQuotationUpload_(payload) {
	return api_('/gmail-addon/prepare-quotation-upload', {
		method: 'post',
		payload,
	});
}

function createQuotation_(payload) {
	return api_('/gmail-addon/create-quotation', { method: 'post', payload });
}
