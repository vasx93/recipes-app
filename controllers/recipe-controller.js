const Recipe = require('../models/recipe-model');
const Category = require('../models/category-model');

const addRecipe = async (req, res) => {
	try {
		const ingredients = req.body.ingredients;
		const measure = req.body.measure;

		// Pair each ingredient with its measure
		ingredients.forEach((el, index) => {
			measure.forEach((val, idx) => {
				if (index === idx) {
					el.measure = val;
				}
			});
		});

		// query category doc
		let category = await Category.findOne({ name: req.body.category });

		if (!category) {
			category = await Category.create({ name: req.body.category });
		}

		// Create recipe doc
		const recipe = await Recipe.create({
			name: req.body.name,
			description: req.body.description,
			ingredients,
			video: req.body.video,
			category: req.body.category,
		});

		if (!recipe || !category) {
			return res.status(400).send({ message: 'Something went wrong' });
		}

		// saving recipe doc to category it belongs to
		category.recipes.push(recipe);
		await category.save();

		res.status(201).json({ message: 'New recipe added', recipe });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const getRecipe = async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.id);

		if (!recipe) {
			return res.status(404).send({ message: 'Recipe not found' });
		}

		res.status(200).json({ recipe });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const getAllRecipes = async (req, res) => {
	try {
		const recipes = await Recipe.find();

		if (!recipes) {
			return res.status(400).send({ message: 'Something went wrong' });
		}

		res.status(200).json({ results: recipes.length, recipes });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const editRecipe = async (req, res) => {
	try {
		// Query the recipe doc
		const recipe = await Recipe.findById(req.params.id);

		if (!recipe) {
			return res.status(404).send({ message: 'Recipe not found' });
		}

		// Check if the category has changed
		if (req.body.category && req.body.category !== recipe.category) {
			// Query old category
			const category = await Category.findOne({ name: recipe.category });

			if (category) {
				// Remove recipe doc from array
				const index = category.recipes.indexOf(recipe._id);

				if (index != -1) {
					category.recipes.splice(index, 1);
				}
				await category.save({ new: true, runValidators: true });
			}

			// Update doc
			Object.keys(req.body).forEach(el => {
				recipe[el] = req.body[el];
			});
			await recipe.save({ new: true, runValidators: true });

			// find new category
			const newCategory = await Category.findOne({ name: req.body.category });

			// if it doesnt exist create one
			if (!newCategory) {
				const created = await Category.create({ name: req.body.category });
				created.recipes.push(recipe);
				await created.save();
			} else {
				newCategory.recipes.push(recipe);

				await newCategory.save();
			}
		} else {
			// Update doc
			Object.keys(req.body).forEach(el => {
				recipe[el] = req.body[el];
			});

			await recipe.save({ new: true, runValidators: true });
		}
		res.status(200).json({ message: 'Recipe updated!', recipe });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

const deleteRecipe = async (req, res) => {
	try {
		// query the recipe doc
		const recipe = await Recipe.findById(req.params.id);

		// Query category
		const category = await Category.findOne({ name: recipe.category });

		if (!recipe || !category) {
			return res.status(404).send({ message: 'Recipe not found' });
		}

		// Remove the recipe from its category
		const index = category.recipes.indexOf(recipe._id);

		if (index != -1) {
			category.recipes.splice(index, 1);
		}
		await category.save();
		await recipe.delete();

		res.status(204).json();
	} catch (err) {
		res.status(400).send(err.message);
	}
};

module.exports = {
	addRecipe,
	getRecipe,
	getAllRecipes,
	editRecipe,
	deleteRecipe,
};
