require('dotenv').config()

const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const { SECRET } = process.env
module.exports = { PORT, MONGODB_URI, SECRET }
