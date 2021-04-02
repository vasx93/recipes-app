const express = require('express');
const {
	addRecipe,
	getRecipe,
	getAllRecipes,
	editRecipe,
	deleteRecipe,
} = require('../controllers/recipe-controller');

const router = express.Router();

router.get('/getRecipes', getAllRecipes);
router.get('/getRecipe/:id', getRecipe);

router.post('/addRecipe', addRecipe);

router.patch('/editRecipe/:id', editRecipe);
router.delete('/deleteRecipe/:id', deleteRecipe);

module.exports = router;
