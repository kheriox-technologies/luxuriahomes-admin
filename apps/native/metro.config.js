'use strict';
// Metro config for an Expo app inside a pnpm/Turborepo monorepo, wrapped with
// Nativewind. watchFolders lets Metro see the hoisted root node_modules and
// sibling workspace packages; nodeModulesPaths sets the resolution order.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, 'node_modules'),
	path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = withNativeWind(config, { input: './src/global.css' });
