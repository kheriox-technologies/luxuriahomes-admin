interface LogFn {
	(msg: string): void;
	(obj: object, msg?: string): void;
}

interface Logger {
	child: (bindings: object) => Logger;
	debug: LogFn;
	error: LogFn;
	info: LogFn;
	warn: LogFn;
}

function createLogger(baseContext: object = {}): Logger {
	const log = (level: string) => {
		return (objOrMsg: string | object, msg?: string) => {
			const logObj =
				typeof objOrMsg === 'string'
					? { ...baseContext, level, msg: objOrMsg }
					: { ...baseContext, level, ...objOrMsg, msg };

			console.log(
				JSON.stringify({
					...logObj,
					time: Date.now(),
				})
			);
		};
	};

	return {
		info: log('info'),
		error: log('error'),
		warn: log('warn'),
		debug: log('debug'),
		child: (bindings) => createLogger({ ...baseContext, ...bindings }),
	};
}

export const logger = createLogger();
