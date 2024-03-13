const jwt = require('../../utils/jwt');

const validateUser = async (req, res, next) => {
	const authHeader = await req.get('authorization');
	if (authHeader) {
		try {
			const [, token] = authHeader.split(' ');
			const user = await jwt.verify(token);
			req.user = user;

			return next();
		} catch (error) {
			console.log(error);
		}
	}
	return next();

};

const isLoggedIn = (req, res, next) => {
	if (req.user)
		return next();
	const error = new Error('Un-authorized');
	res.status(403);
	return next(error)
}


module.exports = {
	validateUser,
	isLoggedIn
}