const Blog = require("../models/blog")

const initialBlogs = [
	{
		title: "The United Nations",
		author: "Michael Santos",
		url: "http://unep.com",
		likes: 10
	},
	{
		title: "Human Coders",
		author: "Nikola Cavlina",
		url: "http://phd.com",
		likes: 18
	},
	{
		title: "Business Ideas",
		author: "Iliman Ndiaye",
		url: "http://von.com",
		likes: 3
	}
]

const nonExistingId = async () => {
	const blog = new Blog({ title: "willremovethissoon" })
	await blog.save()
	await blog.deleteOne()

	return blog._id.toString()
}

const existingId = async () => {
	const blog = new Blog({ title: "Test blog title", author: "Test blog author", url: "Test blog link", likes: "Tet blog likes" })
	await blog.save()

	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, nonExistingId, existingId, blogsInDb }