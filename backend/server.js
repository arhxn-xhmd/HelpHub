const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const authRouter = require('./router/auth');
const userRouter = require('./router/user');
const postRouter = require('./router/post');
const problemRouter = require('./router/problems');
const answerRouter = require('./router/answer');

// Create a new Express application
const app = express()
const port = 3000

// Connection URL
app.use(cors())
app.use(express.json())

// Use the auth router for authentication routes
app.use('/auth', authRouter)

// Use the user router for user-related routes
app.use('/user', userRouter)

// Use the post router for post-related routes
app.use('/post', postRouter)

app.use('/problems', problemRouter)

app.use('/answers', answerRouter)

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
