export const notFound = (req, res, next) => {
	const error = new Error(`Not found - ${req.originalUrl} `)
	res.status(404);
	next(error);
}

export const errorHandler = (error, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		status: statusCode,
		message: error.message,
		stack: process.env.ENVIRONMENT === 'production' ? 'Stack visible only in development' : error.stack,
		errors: error.errors || undefined
	})

}

