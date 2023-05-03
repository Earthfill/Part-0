const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

const jwt = require("jsonwebtoken")

const getTokenFrom = request => {
	const authorization = request.get("authorization")
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "")
	}
	return null
}

blogsRouter.get("/",async  (request, response) => {
	const blogs = await Blog
		.find({}).populate("user", { username: 1, name: 1 })
	response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
	const body = request.body
	// const blog = new Blog(request.body)

	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" })
	}
	const user = await User.findById(body.userId)

	if (!body.title || !body.url) {
		return response.status(400).json({ error: "title or url missing" })
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes !== undefined ? body.likes : 0,
		user: user.id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog)
})

blogsRouter.put("/:id", async (request, response) => {
	const body = request.body
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
	return response.status(200).json(updatedBlog)
})

blogsRouter.delete("/:id", async (request, response) => {
	const body = request.body

	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" })
	}
	await User.findById(body.userId)

	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

module.exports = blogsRouter