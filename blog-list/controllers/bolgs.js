const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { body } = request
  const { user } = request
  if (!user) {
    return response
      .status(401)
      .json({
        error: 'token invalid',
      })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    // eslint-disable-next-line no-underscore-dangle
    user: user._id,
  })

  const savedBlog = await blog.save()
  // eslint-disable-next-line no-underscore-dangle
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const result = await savedBlog.populate('user', { username: 1, name: 1 })
  // eslint-disable-next-line no-underscore-dangle
  return response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const { user } = request
  // eslint-disable-next-line no-underscore-dangle
  if (!(blog.user.toString() === user._id.toString())) {
    return response
      .status(401)
      .json({
        error: 'invalid token',
      })
  }

  user.blogs = user.blogs.filter((b) => b.toString() !== blog.id.toString())

  await user.save()
  await Blog.findByIdAndRemove(request.params.id)
  return response.status(204).end()
})

// eslint-disable-next-line consistent-return
blogRouter.put('/:id', async (request, response) => {
  const { user } = request
  if (!user) {
    return response
      .status(401)
      .json({
        error: 'token invalid',
      })
  }

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    comments: request.body.comments,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  const result = await updatedBlog.populate('user', { username: 1, name: 1 })
  response.json(result)
})

// eslint-disable-next-line consistent-return
blogRouter.post('/:id/comments', async (request, response) => {
  const { user } = request

  if (!user) {
    return response
      .status(401)
      .json({
        error: 'token invalid',
      })
  }

  let blogToComment = await Blog.findById(request.params.id)
  blogToComment = blogToComment.toJSON()
  const blog = {
    ...blogToComment,
    comments: blogToComment.comments.concat(request.body),
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  const result = await updatedBlog.populate('user', { username: 1, name: 1 })
  response.json(result)
})

module.exports = blogRouter
