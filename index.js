require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import routers
const userRouter = require('./routes/user-router');
const categoryRouter = require('./routes/category-router');
const recipesRouter = require('./routes/recipe-router');

// Start the app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/recipes', recipesRouter);

// Atlas connection
const mongo_test =
	'mongodb+srv://test-user:test1234@cluster0.fd7gw.mongodb.net/recipes-app?retryWrites=true&w=majority';
mongoose
	.connect(mongo_test, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log(`MongoDB connection successful`))
	.catch(err => console.log(err));

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App is live on port ${port}`);
});
