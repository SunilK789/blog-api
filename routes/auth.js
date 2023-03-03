var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = "Sunil's Link";

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profile");
var fetchuser = require("../middleware/fetchuser");

//ROUTE 1: create user using: POST "/api/auth/createuser". Login required
router.post("/createuser", async (req, res) => {
	let success = false;
	const { name, username, email, password } = req.body;

	try {
		const existedUser = await User.findOne({ email: email });
		if (existedUser) {
			return res.status(400).json({
				success,
				error: "Internal Server Error",
			});
		}
		const existedUserName = await User.findOne({ username: username });
		if (existedUserName) {
			return res.status(400).json({
				success,
				error: "Internal Server Error",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const secPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name: name,
			username: username,
			email: email,
			password: secPassword,
		});
		const data = await {
			user: {
				id: user.id,
			},
		};

		const profile = await Profile.create({
			user: user.id,
			name: name,
			username: username,
			email: email,
		});

		const authToken = await jwt.sign(data, JWT_SECRET);
		success = true;
		return res.json({ success, authToken });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success, error: "Some error occured!" });
	}
});
//ROUTE 2: Login user using: POST "/api/auth/login". email and password required
router.post("/login", async (req, res) => {
	let success = false;

	//check wheather the user exist with same email id
	try {
		let user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res
				.status(400)
				.json({ success, error: "Please try to enter correct credencials!" });
		}

		const passwordComapre = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!passwordComapre) {
			return res
				.status(400)
				.json({ success, error: "Please try to enter correct credencials!" });
		}

		const data = {
			user: {
				id: user._id,
			},
		};
		const authToken = await jwt.sign(data, JWT_SECRET);
		success = true;
		res.json({ success, authToken });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success, error: "Internal Server Error" });
	}
});
router.post("/google", async (req, res) => {
	const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
	console.log(tokens);

	res.json(tokens);
});

//ROUTE 5: create user email using: POST "/api/auth/checkemail". Login required
router.post("/checkemail", fetchuser, async (req, res) => {
	let success = false;
	const { email } = req.body;

	try {
		const existedEmail = await User.findOne({ email: email });
		if (existedEmail) {
			return res.status(400).json({
				success,
				errors: [{ message: "Email id already exist!" }],
			});
		}

		success = true;
		return res.status(200).json({
			success,
			errors: [{ message: "EmailId don't exist!" }],
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Some error occured at /createprofile!");
	}
});

//ROUTE 5: create username using: POST "/api/auth/checkusername". Login required
router.post("/checkusername", async (req, res) => {
	let success = false;
	const { username } = req.body;

	try {
		const existedUserName = await User.findOne({ username: username });
		if (existedUserName) {
			return res.status(400).json({
				success,
				errors: [{ message: "Username already exist!" }],
			});
		}

		success = true;
		return res.status(200).json({
			success,
			errors: [{ message: "Username don't exist!" }],
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Some error occured at /createprofile!");
	}
});

module.exports = router;
