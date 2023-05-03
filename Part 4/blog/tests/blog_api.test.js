const mongoose = require("mongoose")
const supertest = require("supertest")
const bcrypt = require("bcrypt")

const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

const User = require("../models/user")
const Blog = require("../models/blog")

describe("when there is initially some blogs saved", () => {
	let token

	beforeEach(async () => {
		await User.deleteMany({})
		await Blog.deleteMany({})

		const user = {
			username: "testuser",
			password: "testpassword",
			name: "Test User",
		}

		await api.post("/users").send(user)

		const response = await api.post("/login").send(user)

		token = response.body.token

		// const noteObjects = helper.initialNotes.map(note => new Note(note))
		// const promiseArray = noteObjects.map(note => note.save())
		// await Promise.all(promiseArray)
		await Blog.insertMany(helper.initialBlogs)
	})

	test("blogs are returned as json", async () => {
		await api
			.get("/blogs")
			.set(`Authorization", "Bearer ${token}`)
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})

	test("all blogs are returned", async () => {
		const response = await api.get("/blogs").set("Authorization", `Bearer ${token}`)

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
	let token

	beforeEach(async () => {
		await User.deleteMany({})
		await Blog.deleteMany({})

		const user = {
			username: "testuser",
			password: "testpassword",
			name: "Test User",
		}

		await api.post("/users").send(user)

		const response = await api.post("/login").send(user)

		token = response.body.token

		// const noteObjects = helper.initialNotes.map(note => new Note(note))
		// const promiseArray = noteObjects.map(note => note.save())
		// await Promise.all(promiseArray)
		await Blog.insertMany(helper.initialBlogs)
	})

	test("a valid blog can be added", async () => {
		const newBlog = {
			title: "async/await simplifies making async calls",
			author: "John Doe",
			url: ".com",
			likes: 100
		}

		await api
			.post("/blogs")
			.set("Authorization", `Bearer ${token}`)
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

	test("adding a blog without a token returns a 401 status code", async () => {
		const newBlog = {
			title: "Test blog 4",
			author: "Test author 4",
			url: "http://www.example.com/4",
			likes: 40
		}

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(401)

		const response = await api.get("/api/blogs").set("Authorization", `Bearer ${token}`)

		expect(response.body).toHaveLength(3)
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

describe("when there is initially one user in the db", () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash("sekret", 10)
		const user = new User({ username: "root", passwordHash })

		await user.save()
	})

	test("invalid user is not created", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			name: "John Doe",
			password: "pw",
		}

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		expect(result.body.error).toContain("Username is required")

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test("creation fails with proper statuscode and message if username already taken", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: "jackie",
			name: "jack",
			password: "jhenny",
		}

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		expect(result.body.error).toContain("expected `username` to be unique")

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})


})

afterAll(async () => {
	await mongoose.connection.close()
})