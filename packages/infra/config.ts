import { Config, getStack } from '@pulumi/pulumi';

export const envName = getStack();
export const appConfig = new Config('app');
export const awsConfig = new Config('aws');

export const defaultTags = {
	AppName: appConfig.require('appName'),
	Env: envName,
};
