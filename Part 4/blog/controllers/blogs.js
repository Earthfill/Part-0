const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

const { userExtractor } = require("../utils/middleware")

blogsRouter.get("/",async  (request, response) => {
	const blogs = await Blog
		.find({}).populate("user", { username: 1, name: 1 })

	response.json(blogs)
})

blogsRouter.post("/", userExtractor, async (request, response) => {
	const body = request.body
	// const blog = new Blog(request.body)
	const user = request.user

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes !== undefined ? body.likes : 0,
	})

	if (!body.title || !body.url) {
		return response.status(400).json({ error: "title or url missing" })
	}

	if (!user) {
		return response.status(401).json({ error: "operation not permitted" })
	}

	blog.user = user._id

	const createdBlog = await blog.save()

	user.blogs = user.blogs.concat(createdBlog._id)
	await user.save()

	response.status(201).json(createdBlog)
})

blogsRouter.put("/:id", userExtractor, async (request, response) => {
	const body = request.body
	const user = request.user

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	if (!user) {
		return response.status(401).json({ error: "operation not permitted" })
	}

	blog.user = user._id

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
	return response.status(200).json(updatedBlog)
})

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
	const blog = await Blog.findByIdAndRemove(request.params.id)

	const user = request.user

	if (!user || !blog || blog.user.toString() !== user.id.toString()) {
		return response.status(401).json({ error: "operation not permitted" })
	}

	user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString() )

	response.status(204).end()
})

module.exports = blogsRouter