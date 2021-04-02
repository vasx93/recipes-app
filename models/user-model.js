const mongoose = require('mongoose');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true,
			validate(value) {
				if (!isEmail(value)) {
					throw new Error('Invalid email format!');
				}
			},
		},

		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 6,
			validate(value) {
				if (value.toLowerCase().includes('password')) {
					throw new Error('Password cannot contain -password-');
				}
			},
		},

		firstName: {
			type: String,
			required: true,
			trim: true,
			default: 'John',
			maxlength: 20,
		},

		lastName: {
			type: String,
			required: true,
			trim: true,
			default: 'Doe',
			maxlength: 30,
		},

		recipes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Recipe',
			},
		],
	},
	{ timestamps: true }
);

// Login static method
userSchema.statics.loginUser = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Account does not exist!');
	}

	const match = await user.comparePassword(password, user.password);

	if (!match) {
		throw new Error('Wrong credentials');
	}
	return user;
};

// Generate JWT
userSchema.methods.generateToken = async function () {
	const user = this;

	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	});

	return token;
};

// Decode JWT
userSchema.statics.validateToken = async function (token) {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const user = await User.findOne({ _id: decoded._id });
	if (!user) {
		throw new Error('No user found');
	}
	return user;
};

// Compare password
userSchema.methods.comparePassword = async function (plainPw, userPw) {
	return await bcrypt.compare(plainPw, userPw);
};

// Hashing the password - pre-save hook
userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 6);
	}
	next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
