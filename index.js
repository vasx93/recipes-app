require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

// Import routers
const userRouter = require('./routes/user-router');
const categoryRouter = require('./routes/category-router');
const recipesRouter = require('./routes/recipe-router');

// Start the app
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/recipes', recipesRouter);

app.use('*', (req, res) => res.sendFile(path.join(__dirname, './index.html')));

// Atlas connection

mongoose
	.connect(process.env.DB_TEST, {
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
