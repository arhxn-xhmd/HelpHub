const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cloudinary = require("../config/cloudinary");
const authMiddleware = require('../middlewares/authMiddleware');

// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'helphub';
client.connect()

router.use(express.json())

router.get('/', async (req, res) => {
    const db = client.db(dbName);
    const problemCollection = db.collection('problems');
    const userCollection = db.collection('users')

    let problems = await problemCollection.find({}).toArray();

    for (let problem of problems) {
        const user = await userCollection.findOne(
            { _id: new ObjectId(problem.userId) },  
            { projection: { username: 1, profilePic: 1 } }
        );

        problem.user = user;
    }

    res.json(problems);
})

router.get('/profile', authMiddleware, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('problems');

    let allProblems = await collection.find({}).toArray()

    let userProblems = allProblems.filter((problem) => {
        return problem.userId == req.id
    })

    res.json(userProblems)
})

router.delete('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('problems');
    const data = req.body;

    if (data.problemPic) {
        let result = await cloudinary.uploader.destroy(data.problemPicId);
    }

    let result = await collection.deleteOne({ _id: new ObjectId(data.id) })
    res.json({success: true, message: "Post deleted!"})
})

module.exports = router