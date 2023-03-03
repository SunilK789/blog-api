const express = require("express")
const connectToMongo = require("./DatabaseConnections/db")
var cors = require("cors")
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

connectToMongo()

app.get("/", (req, res) => {
	res.send("Hello World I am back2!")
})

app.use("/api/auth", require("./routes/auth"))
app.use("/api/blog", require("./routes/blog"))

app.listen(port, () => {
	console.log(`My-blog app listening on port ${port}`)
})
