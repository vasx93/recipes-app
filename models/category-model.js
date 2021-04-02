const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			minlength: 1,
		},

		image: [String],

		recipes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Recipe',
			},
		],
	},
	{ timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
