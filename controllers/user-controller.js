const User = require('../models/user-model');
const Recipe = require('../models/recipe-model');

const checkProfile = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id });

		if (!user) {
			return res.status(404).send({ message: 'User not found' });
		}

		res.status(200).json({ user, token: req.token });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const signup = async (req, res) => {
	try {
		const user = await User.create({ ...req.body });

		if (!user) {
			return res.status(400).send({ message: 'Something went wrong' });
		}

		const token = await user.generateToken(user._id);

		res
			.status(201)
			.json({ message: 'User created successfully!', user, token });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const login = async (req, res) => {
	try {
		const user = await User.loginUser(req.body.email, req.body.password);

		const token = await user.generateToken();

		res.status(200).json({ message: 'User logged in!', user, token });
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
};

const addFavouriteRecipe = async (req, res) => {
	try {
		// Query recipe
		const recipe = await Recipe.findById(req.params.id);

		if (!recipe) {
			return res.status(404).send({ message: 'Recipe not found' });
		}

		if (req.user.recipes.indexOf(recipe._id) != -1) {
			return res.status(400).send({ message: 'Recipe already added!' });
		}

		req.user.recipes.push(recipe._id);
		await req.user.save({ new: true, runValidators: true });

		res
			.status(200)
			.json({ message: 'Recipe successfuly added!', user: req.user });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		if (!users) {
			return res.status(400).send({ message: 'Something went wrong' });
		}

		res.status(200).json({ results: users.length, users });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

module.exports = {
	getAllUsers,
	checkProfile,
	signup,
	login,
	addFavouriteRecipe,
};
