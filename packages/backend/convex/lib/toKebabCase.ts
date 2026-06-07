export function toKebabCase(fileName: string): string {
	const lastDot = fileName.lastIndexOf('.');
	const ext = lastDot > 0 ? fileName.slice(lastDot) : '';
	const stem = fileName.slice(0, lastDot > 0 ? lastDot : undefined);
	const kebab = stem
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return `${kebab}${ext.toLowerCase()}`;
}
