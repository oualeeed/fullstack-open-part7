const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: String,
})

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: String,
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [commentSchema],
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    returnedObject.id = returnedObject._id.toString()
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject._id
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
