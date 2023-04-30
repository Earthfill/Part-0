const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0;
  let favorite = null;
  blogs.find(blog => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favorite = blog;
    }
  })

  return { title: favorite.title, author: favorite.author, likes: favorite.likes }
}

const mostBlogs = (blogs) => {
  const topAuthor = _.maxBy(blogs, 'blogs')
  return { author: topAuthor.author, blogs: topAuthor.blogs }
}

const mostLikes = (likes) => {
  const topAuthor = _.maxBy(likes, 'likes')
  return { author: topAuthor.author, likes: topAuthor.likes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
