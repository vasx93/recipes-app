const mongoose = require('mongoose');
const Recipe = require('../models/recipe-model');
const User = require('../models/user-model');
const Category = require('../models/category-model');

const data = require('../../data.json');

mongoose.connect(process.env.DB).then(() => {
	const createMovies = async () => {
		await Movie.remove({});

		data.forEach(async movie => {
			const newmovie = new Movie({ ...movie });
			await newmovie.save();
		});

		const admin = new User({
			firstName: 'John',
			lastName: 'Doe',
			email: 'example@mail.com',
			password: '1234567',
			location: {
				city: 'Belgrade',
				country: 'Serbia',
				address: 'Timočka 11',
			},
		});

		await admin.save();

		process.exit();
	};

	createMovies();
});
