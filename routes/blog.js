const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Blog = require("../models/Blog");
var fetchuser = require("../middleware/fetchuser");

//ROUTE 1: Get all blogs using: POST "/api/blog/getallblogs". Login required
router.get(
	"/getallblogs",
	//fetchuser,
	async (req, res) => {
		try {
			//const blogs = await Blog.find({user: req.user.id})
			const blogs = await Blog.find();
			res.json({blogs});
			//res.json(req.user)
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Some error occured!");
		}
	}
);

router.get(
	"/getblogbyid/:id",
	//fetchuser,
	async (req, res) => {
		try {
			//const blogs = await Blog.find({user: req.user.id})
			const blog = await Blog.findOne({ _id: req.params.id });
			res.json(blog);
			//res.json(req.user)
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Some error occured!");
		}
	}
);

//ROUTE 2: Add new not using: POST "/api/blog/addblog". Login required
router.post(
	"/addblog",
	//fetchuser,
	// [
	// 	body("title", "Title must be atleast 3 character").isLength({min: 3}),
	// 	body("description", "Description must be atleast 3 character").isLength({
	// 		min: 3,
	// 	}),
	// 	body("tag", "Tag must be atleast 3 character").isLength({min: 3}),
	// ],
	async (req, res) => {
		//If there are errors return bad request
		// const errors = validationResult(req)
		// if (!errors.isEmpty()) {
		// 	return res.status(400).json({errors: errors.array()})
		// }
		let success = false;
		const { author, title, description, tag } = req.body;
		try {
			const blog = Blog.create({
				//user: req.user.id,
				author,
				title,
				description,
				tag,
			});

			success = true;
			const newblog = await blog.json;
			res.status(200).json({ newblog, success });
		} catch (error) {
			console.error(error.message);
			res.status(500).json({ success, error: "Some error occured!" });
		}
	}
);
router.get(
	"/getallbytag/:tag",
	//fetchuser,
	async (req, res) => {
		let success = false;
		try {
			//const blogs = await Blog.find({user: req.user.id})
			const searchString = "/" + req.params.tag + "/";
			console.log("searchString: ", searchString);
			const blogs = await Blog.find({
				tag: { $regex: req.params.tag, $options: "i" },
			});

			//const allTags = await res.json(tags);
			success = true;
			res.status(200).json({ success, blogs });
		} catch (error) {
			console.error(error.message);
			res.status(500).json({ success, error: "Some error occured!" });
		}
	}
);
router.get(
	"/getalltitles",
	//fetchuser,
	async (req, res) => {
		let success = false;
		try {
			//const blogs = await Blog.find({user: req.user.id})
			const titles = await Blog.find({}, { title: 1 });

			//const allTags = await res.json(tags);
			success = true;
			res.status(200).json({ success, titles });
		} catch (error) {
			console.error(error.message);
			res.status(500).json({ success, error: "Some error occured!" });
		}
	}
);
router.get(
	"/getalltags",
	//fetchuser,
	async (req, res) => {
		let success = false;
		try {
			//const blogs = await Blog.find({user: req.user.id})
			const tags = await Blog.find({}, { tag: 1 });

			//const allTags = await res.json(tags);
			success = true;
			res.status(200).json({ success, tags });
		} catch (error) {
			console.error(error.message);
			res.status(500).json({ success, error: "Some error occured!" });
		}
	}
);
//ROUTE 3: Delete blog by title: POST "/api/blog/deleteblogbytitle". Login required
router.delete(
	"/deleteblogbytitle",
	fetchuser,
	[body("title", "Title must be atleast 3 character").isLength({ min: 3 })],
	async (req, res) => {
		//If there are errors return bad request
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { title } = req.body;

		try {
			const blogs = await blog.findOneAndDelete({ blog: req.user.id, title });

			res.json(blogs);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Some error occured!");
		}
	}
);

//ROUTE 4: Delete blog by tag: POST "/api/blog/deleteblogbytag". Login required
router.delete(
	"/deleteblogbytag",
	fetchuser,
	[body("tag", "Tag must be atleast 3 character").isLength({ min: 3 })],
	async (req, res) => {
		//If there are errors return bad request
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { tag } = req.body;

		try {
			const blogs = await blog.findOneAndDelete({ blog: req.user.id, tag });

			res.json(blogs);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Some error occured!");
		}
	}
);

//ROUTE 5: Update blog : POST "/api/blog/updateblog/:id". Login required
router.put("/updateblog/:id", fetchuser, async (req, res) => {
	//If there are errors return bad request

	const { title, description, tag } = req.body;

	try {
		let newblog = {};
		if (title) {
			newblog.title = title;
		}
		if (description) {
			newblog.description = description;
		}
		if (tag) {
			newblog.tag = tag;
		}

		const blog = await blog.findById(req.params.id);
		if (!blog) {
			return res.status(404).send("Not Found");
		}

		if (blog.user.toString() !== req.user.id) {
			return res.status(401).send("Not Allowed");
		}

		const updatedblog = await blog.findByIdAndUpdate(
			req.params.id,
			{ $set: newblog },
			{ new: true }
		);

		res.json(updatedblog);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Some error occured!");
	}
});
//ROUTE 6: Delete blog by id using : DELETE "/api/blog/deleteblog/:id". Login required
router.delete("/deleteblog/:id", fetchuser, async (req, res) => {
	try {
		const blog = await blog.findById(req.params.id);
		if (!blog) {
			return res.status(404).send("Not Found");
		}

		if (blog.user.toString() !== req.user.id) {
			return res.status(401).send("Not Allowed");
		}

		const deletedblog = await blog.findByIdAndDelete(req.params.id);

		return res.status(200).send({ Success: "blog deleted succefully" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Some error occured!");
	}
});

module.exports = router;
