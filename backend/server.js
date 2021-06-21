import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

dotenv.config()

import data from './data.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/finalproject"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

//Model for Positive Thought
const positiveThoughtSchema = mongoose.Schema({
  message: String,
  thumbsup:{
    type:Number,
    default:0
  },
  createdAT:{
    type:Date,
    default: Date.now
  }    
})

//PositiveThought model
const PositiveThought = mongoose.model('PositiveThought', positiveThoughtSchema)
 

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
  email:{
    type:String,
    trim:true,
    lowercase:true,
    unique:[true, 'This email is already in use, please try with another one'],
    required:[true, 'Email is required']
  },
  accessToken: {
    type:String,
    default:() => crypto.randomBytes(128).toString('hex')
  }
})

const resource1Schema = new mongoose.Schema ({
  picture:String,
  first_name:String,
  last_name:String,
  email:String,
  company:String,
  country:String,
  city:String,
  website:String,
  modality:String,
  category:String
})

//Model from resourcesSchema
const Resource1 = mongoose.model('Resource1', resource1Schema)

const newResource1 = new Resource1({
  "picture": "https://robohash.org/commodinatushic.png?size=50x50&set=set1",
  "first_name": "Jody",
  "last_name": "Gee",
  "email": "jgee0@zdnet.com",
  "company": "Gutkowski-Kilback",
  "country": "Sweden",
  "city": "Stockholm",
  "website": "jugem.jp",
  "modality": "in-person, remote",
  "category": "Reiki"
})
newResource1.save()

//Seeding of our database
if (process.env.RESET_DB) {
  
  const seedDB = async () => {
    await Resource1.deleteMany()

    await data.forEach(item => {
      const newResource1 = new Resource1(item)
      newResource1.save()
    })
  }    
  seedDB()
} 

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


const port = process.env.PORT || 3005
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/resources_1', async (req, res) => {
  const resources_1 = await Resource1.find()
  res.json(resources_1);
})

//An endpoint to get all thoughts
/* app.get('/pos_sharing', authenticateUser)
 */
 
/* app.post('/pos_sharing', authenticateUser) */

app.post('/pos_sharing', async (req, res) => {
  console.log("hello")
  const newPositiveThought = await new PositiveThought(req.body).save();
    res.json(newPositiveThought) 
})
/*  app.post('/pos_sharing', async (req, res) => {
  try {
    const newPositiveThought = await new PositiveThought(req.body).save()
    res.json(newPositiveThought)
    } catch (error) {
      if (error.code === 11000) {
      res.status(400).json({ message: 'Duplicated value', fields: error.keyValue })
    }
    res.status(400).json(error)
    }
  }) */
 

/*   const { message } = req.body

  try {
    const newPositiveThought = await new PositiveThought ({ message }).save()
    res.json({ success:true, newPositiveThought });
  } catch (error) {
    res.status(400).json({ success:false, message: 'Invalid request', error })
  }
}) */

app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
    const salt = bcrypt.genSaltSync() 

    const newUser = await new User({
      username,
      password: bcrypt.hashSync(password, salt)
    }).save()

    res.json({
     success: true, 
     userID: newUser._id,
     username: newUser.username,
     accessToken: newUser.accessToken
    })
  } catch (error) {
    res.status(400).json({ success:false, message: 'Invalid request', error })
  }
})

//An endpoint to signin
app.post('/signin', async (req, res) => {
  const { usernameOrEmail, password } = req.body

  try {
    const user = await User.findOne({ 
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    })

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        success: true, 
        userId: user._id,
        username: user.username,
        email:user.email,
        accessToken: user.accessToken
      })
    } else {
      res.status(404).json({ success:false, message: 'User not found' });
    }                          
  } catch (error) {
    res.status(400).json({ success:false, message: 'Invalid request', error });
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
