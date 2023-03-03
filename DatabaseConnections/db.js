const mongoose = require("mongoose")
const mongoUri = "mongodb://127.0.0.1:27017/my-blog"
// const mongoUri =
// 	"mongodb://mylinkcentral-db:rcPiPqqlq9qMt9r0gabfrikKNVp2pAUFEpXAbKxMdqfTUY5RSFsUiQdb5ANgSGeoZnutVE0kGOhRACDbw7TuwA==@mylinkcentral-db.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@mylinkcentral-db@"

const connectToMongo = () => {
	mongoose.connect(mongoUri)
}

module.exports = connectToMongo
