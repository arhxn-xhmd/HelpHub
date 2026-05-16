const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectId } = require('mongodb');

// Load environment variables from .env file
dotenv.config()

// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'helphub';
client.connect()

// Middleware to parse JSON bodies
router.use(express.json())

// Route for user signup
router.post('/signup', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('users');
    const data = req.body;

    const existingEmail = await collection.findOne({ email: data.email })
    if (existingEmail) {
        return res.status(404).json({
            reason: "Email",
            message: "Email already exists."
        })
    }

    const existingUser = await collection.findOne({ username: data.username })
    if (existingUser) {
        return res.status(404).json({
            reason: "Username",
            message: "Username already exists."
        })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    data.profilePic = "";
    data.posts = 0
    data.answers = 0

    const result = await collection.insertOne(data);

    const token = jwt.sign(
        { userId: result.insertedId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return res.json({ token: token })
})

router.post('/signin', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('users');
    const data = req.body;

    const userData = await collection.findOne({ email: data.email });
    if (!userData) {
        return res.status(404).json({
            reason: "Email",
            message: "No such email found."
        })
    }

    if (data.username !== userData.username) {
        return res.status(404).json({
            reason: "Username",
            message: "Username not found."
        })
    }

    const isMatch = await bcrypt.compare(data.password, userData.password);

    if (!isMatch) {
        return res.status(400).json({
            reason: "Password",
            message: "Incorrect Password, Try Again"
        });
    }

    const token = jwt.sign(
        { userId: userData._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token: token })
})

module.exports = router