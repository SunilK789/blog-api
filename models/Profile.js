const mongoose = require("mongoose")
const {Schema} = mongoose

const ProfileSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	},
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	professionalTitle: {
		type: String,
	},
	profilePicUrl: {
		type: String,
	},

	date: {
		type: Date,
		default: Date.Now,
	},
})

module.exports = mongoose.model("profiles", ProfileSchema)
