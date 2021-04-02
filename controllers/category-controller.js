const Category = require('../models/category-model');
const Recipe = require('../models/recipe-model');

const addCategory = async (req, res) => {
	try {
		const category = await Category.create({ ...req.body });

		if (!category) {
			return res.status(400).send({ message: 'Something went wrong!' });
		}

		res.status(201).json({ message: 'New category added!', category });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const getCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			return res.status(404).send({ message: 'Not Found' });
		}

		res.status(200).json({ category });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const getCategories = async (req, res) => {
	try {
		const categories = await Category.find();

		if (!categories) {
			return res.status(404).send({ message: 'Not Found' });
		}

		res.status(200).json({ results: categories.length, categories });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const editCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		const recipes = await Recipe.find({ _id: { $in: category.recipes } });

		if (!category || recipes) {
			return res.status(404).send({ message: 'Not Found' });
		}

		Object.keys(req.body).forEach(el => (category[el] = req.body[el]));
		await category.save({ new: true, runValidators: true });

		// Apply name changes to all relevant recipes
		recipes.forEach(async el => {
			el.category = category.name;
			await el.save();
		});

		res.status(200).json({ message: 'Category updated!', category });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const deleteCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		const recipes = await Recipe.find({ _id: { $in: category.recipes } });

		if (!category || !recipes) {
			return res.status(404).send({ message: 'Not Found' });
		}

		recipes.forEach(async el => {
			el.category = undefined;
			await el.save();
		});

		await category.delete();
		res.status(204).json();
	} catch (err) {
		res.status(400).send(err.message);
	}
};

module.exports = {
	addCategory,
	getCategory,
	getCategories,
	editCategory,
	deleteCategory,
};
