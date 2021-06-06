import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

//Model for Positive Thought
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

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization')

  try {
    const user = await User.findOne({ accessToken })
      if (user) {
        next()
      } else {
        res.status(401).json({ success:false, message: "Not authenticated" })
      }
  } catch (error){
    res.status(400).json({ success:false, message: "Invalid request", error })
  }
}


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
app.get('/sharing_one', authenticateUser)
app.get('/sharing_one', async (req, res) => {
  const positivethoughts = await PositiveThought.find()
  res.json({ positivethoughts });
})

app.post('/sharing_one', authenticateUser)
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

//An endpoint to signin
app.post('/signin', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        userId: user._id,
        username: user.username,
        accessToken: user.accessToken
      })
    } else {
      res.status(404).json({ message: 'User not found' });
    }                          
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
