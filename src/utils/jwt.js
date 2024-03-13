const jwt = require('jsonwebtoken');

const sign = (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '1d'
		}, (error, token) => {
			if (error) return reject(error);
			return resolve(token);
		})
	})
}
function verify(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
			if (error) return reject(error);
			return resolve(decoded);
		});
	});
}
module.exports = { sign, verify }