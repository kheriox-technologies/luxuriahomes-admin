import { httpRouter } from 'convex/server';
import {
	completeUpload,
	createQuotation,
	listFolders,
	listProjects,
	listServiceProviders,
	listTrades,
	prepareQuotationUpload,
	prepareUpload,
} from './gmailAddon/handlers';

const http = httpRouter();

http.route({
	path: '/gmail-addon/projects',
	method: 'GET',
	handler: listProjects,
});

http.route({
	path: '/gmail-addon/folders',
	method: 'GET',
	handler: listFolders,
});

http.route({
	path: '/gmail-addon/prepare-upload',
	method: 'POST',
	handler: prepareUpload,
});

http.route({
	path: '/gmail-addon/complete-upload',
	method: 'POST',
	handler: completeUpload,
});

http.route({
	path: '/gmail-addon/trades',
	method: 'GET',
	handler: listTrades,
});

http.route({
	path: '/gmail-addon/service-providers',
	method: 'GET',
	handler: listServiceProviders,
});

http.route({
	path: '/gmail-addon/prepare-quotation-upload',
	method: 'POST',
	handler: prepareQuotationUpload,
});

http.route({
	path: '/gmail-addon/create-quotation',
	method: 'POST',
	handler: createQuotation,
});

export default http;
