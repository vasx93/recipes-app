const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 100,
			unique: [true, 'A recipe with this name already exists!'],
		},

		description: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 350,
			trim: true,
		},
		ingredients: [
			{
				_id: false,
				ingredient: {
					type: String,
					required: true,
					trim: true,
					maxlength: 50,
					minlength: 1,
				},
				measure: {
					type: String,
					required: true,
					trim: true,
					minlength: 1,
					maxlength: 30,
				},
			},
		],

		category: {
			type: String,
			trim: true,
			default: 'Uncategorized',
		},

		image: {
			type: String,
		},

		video: {
			type: String,
			default: 'http://www.youtube.com/',
		},
	},
	{ timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
