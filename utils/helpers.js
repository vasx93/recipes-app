const User = require('../models/user-model');

module.exports = {
	async checkToken(req, res, next) {
		try {
			if (
				!req.headers.authorization &&
				!req.headers.authorization.startsWith('Bearer')
			) {
				return res.status(401).send();
			}
			const token = req.headers.authorization.split(' ')[1];

			const user = await User.validateToken(token);

			if (!token || !user) {
				throw new Error();
			}

			req.token = token;
			req.user = user;

			next();
		} catch (err) {
			res.status(401).send({ message: 'Unauthorized attempt!' });
		}
	},
};
