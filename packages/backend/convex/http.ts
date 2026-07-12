import { httpRouter } from 'convex/server';
import {
	completeUpload,
	listFolders,
	listProjects,
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

export default http;
