const mongoose = require("mongoose")
const {Schema} = mongoose

const BlogsSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	},
	author: {
		type: String,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	tag: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.Now,
	},
})

module.exports = mongoose.model("blogs", BlogsSchema)
