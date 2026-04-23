const EMBEDDED_JSON_PATTERN = /\{[\s\S]*?\}/;

function messageFromParsedConvexError(value: unknown): string | null {
	if (!value || typeof value !== 'object') {
		return null;
	}
	const parsed = value as { code?: unknown; message?: unknown };
	if (typeof parsed.message === 'string' && parsed.message.trim()) {
		return parsed.message.trim();
	}
	if (parsed.code === 'CATEGORY_NAME_EXISTS') {
		return 'A category with this name already exists';
	}
	return null;
}

function parseEmbeddedConvexErrorMessage(text: string): string | null {
	const jsonMatch = text.match(EMBEDDED_JSON_PATTERN);
	if (!jsonMatch) {
		return null;
	}
	try {
		const parsed = JSON.parse(jsonMatch[0]);
		return messageFromParsedConvexError(parsed);
	} catch {
		return null;
	}
}

function extractConvexErrorMessage(error: unknown): string | null {
	if (error instanceof Error && error.message) {
		const message = error.message.trim();
		const parsedMessage = parseEmbeddedConvexErrorMessage(message);
		if (parsedMessage) {
			return parsedMessage;
		}
		return message;
	}
	if (typeof error === 'string' && error.trim()) {
		return error.trim();
	}
	if (error && typeof error === 'object' && 'message' in error) {
		const objectMessage = (error as { message?: unknown }).message;
		const parsedMessage = messageFromParsedConvexError(error);
		if (parsedMessage) {
			return parsedMessage;
		}
		if (typeof objectMessage === 'string') {
			const jsonMessage = parseEmbeddedConvexErrorMessage(objectMessage);
			if (jsonMessage) {
				return jsonMessage;
			}
			if (objectMessage.trim()) {
				return objectMessage.trim();
			}
		}
	}
	return null;
}

export function getConvexErrorMessage(
	error: unknown,
	fallback: string
): string {
	return extractConvexErrorMessage(error) ?? fallback;
}
