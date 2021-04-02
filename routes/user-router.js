const express = require('express');
const {
	getAllUsers,
	checkProfile,
	signup,
	login,
	addFavouriteRecipe,
} = require('../controllers/user-controller');
const { checkToken } = require('../utils/helpers');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', checkToken, checkProfile);
router.get('/all', getAllUsers);
router.patch('/addFavouriteRecipe/:id', checkToken, addFavouriteRecipe);
module.exports = router;
