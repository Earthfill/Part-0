const config = require("./utils/config")
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const blogsRouter = require("./controllers/blogs")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

morgan.token("body", (request) => JSON.stringify(request.body))

logger.info("connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB")
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB:", error.message)
	})

app.use(cors())
// app.use(express.static("build"))
app.use(express.json())
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :body"))
app.use(middleware.requestLogger)

app.use("/blogs", blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app