const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")

beforeEach(async () => {
	await Blog.deleteMany({})

	// const noteObjects = helper.initialNotes.map(note => new Note(note))
	// const promiseArray = noteObjects.map(note => note.save())
	// await Promise.all(promiseArray)
	await Blog.insertMany(helper.initialBlogs)
})

describe("when there is initially some blogs saved", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})

	test("all blogs are returned", async () => {
		const response = await api.get("/blogs")

		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})

	test("blog posts have an 'id' property instead of '_id'", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogsAtEnd = blogsAtStart[0]

		expect(blogsAtEnd.id).toBeDefined()
		expect(blogsAtEnd._id).toBeUndefined()
	})
})

describe("addition of a new blog", () => {
	test("a valid blog can be added", async () => {
		const newBlog = {
			title: "async/await simplifies making async calls",
			author: "John Doe",
			url: ".com",
			likes: 100
		}

		await api
			.post("/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

		const title = blogsAtEnd.map(n => n.title)
		expect(title).toContain(
			"async/await simplifies making async calls"
		)
	})

	test("if likes property is missing, it defaults to 0", async () => {
		const newBlog = {
			title: "Testing likes property default value",
			author: "Jane Doe",
			url: "https://example.com",
		}

		const response = await api.post("/blogs").send(newBlog).expect(201)

		const createdBlog = response.body
		expect(createdBlog.likes).toBeDefined()
		expect(createdBlog.likes).toBe(0)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	})

	test("blog without title or url returns 400 Bad Request", async () => {
		const newBlog = {
			author: "Jane Doe",
			likes: 5
		}

		await api
			.post("/blogs")
			.send(newBlog)
			.expect(400)
	})
})

describe("update of a blog", () => {
	test("an individual blog can be updated", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]

		const updatedBlog = {
			...blogToUpdate,
			likes: blogToUpdate.likes + 1
		}

		const response = await api
			.put(`/blogs/${blogToUpdate.id}`)
			.send(updatedBlog)
			.expect(200)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

		const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
		expect(updatedBlogInDb.likes).toBe(blogToUpdate.likes + 1)

		expect(response.body).toMatchObject(updatedBlogInDb)
	})
})

describe("deletion of a blog", () => {
	test("a blog can be deleted", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/blogs/${blogToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(
			helper.initialBlogs.length - 1
		)

		const titles = blogsAtEnd.map(r => r.title)

		expect(titles).not.toContain(blogToDelete.title)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})