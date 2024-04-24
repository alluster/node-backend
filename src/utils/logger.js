import util from 'util';

const createLogger = (type) => (...args) => {
	// eslint-disable-next-line no-console
	console[type](
		...args.map((item) => {
			if (typeof item === 'object') {
				return util.inspect(item, { depth: 5, colors: true });
			}
			return item;
		})
	);
};

export const info = createLogger('log');
export const warn = createLogger('warn');
export const error = createLogger('error');