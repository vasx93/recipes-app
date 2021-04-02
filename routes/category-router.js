const express = require('express');
const {
	addCategory,
	getCategory,
	getCategories,
	editCategory,
	deleteCategory,
} = require('../controllers/category-controller');

const router = express.Router();

router.get('/getCategories', getCategories);
router.get('/getCategory/:id', getCategory);

router.post('/addCategory', addCategory);
router.patch('/editCategory/:id', editCategory);
router.delete('/deleteCategory/:id', deleteCategory);

// router.route('/').get(getAllCategories).post(createCategory);

// router
// 	.route('/:id')
// 	.get(getOneCategory)
// 	.patch(editCategory)
// 	.delete(deleteCategory);

module.exports = router;
