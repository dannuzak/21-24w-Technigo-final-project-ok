import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
mongoose.Promise = Promise

//A model for new Positive Thought
const PositiveThought = mongoose.model('PositiveThought', {
  message: String
})

//A model for User
const User = mongoose.model('User', {
  username: {
    type:String,
    required:true,
    unique:true       
  },
  password: {
    type:String,
    required:true
  },
  accessToken: {
    type:String,
    default:() => crypto.randomBytes(128).toString('hex')
  }
})

const port = process.env.PORT || 3004
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//An endpoint to get all thoughts
app.get('/sharing_one', async (req, res) => {
  const positivethoughts = await PositiveThought.find()
  res.json({ positivethoughts });
})

app.post('/sharing_one', async (req, res) => {
  const { message } = req.body

  try {
    const newPositiveThought = await new PositiveThought ({ message }).save()
    res.json({ newPositiveThought });
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.post('/signup', async (req, res) => {
  const { username, password } = req.body
console.log(username, password)

  try {
    const salt = bcrypt.genSaltSync() 

    const newUser = await new User({
      username,
      password: bcrypt.hashSync(password, salt)
    }).save()

    res.json({
     userID: newUser._id,
     username: newUser.username,
     accessToken: newUser.accessToken
    })
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
