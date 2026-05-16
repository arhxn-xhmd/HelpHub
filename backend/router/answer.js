const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middlewares/authMiddleware");

// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'helphub';
client.connect()

router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage })


router.get('/', async (req, res) => {
    const db = client.db(dbName);
    const answerCollection = db.collection('answers');
    const userCollection = db.collection('users');
    let problemId = req.query.problemId;

    let answers = await answerCollection.find({ problemId }).toArray();

    for (let answer of answers) {
        const user = await userCollection.findOne(
            { _id: new ObjectId(answer.userId) },
            { projection: { username: 1, profilePic: 1 } }
        );

        answer.user = user;
    }

    res.json(answers);
})

router.post('/', upload.single("file"), authMiddleware, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('answers');
    const data = req.body;
    const file = req.file;

    let answerPic = null;
    let answerPicId = null;

    if (file) {
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "answer_pics" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            stream.end(file.buffer);
        });

        answerPic = uploadResult.secure_url;
        answerPicId = uploadResult.public_id;
    }

    const result = await collection.insertOne({ userId: req.id, problemId: data.problemId, answer: data.answer, answerPic: answerPic, answerPicId: answerPicId, likes: 0, dislikes: 0, likedBy: [], dislikedBy: [], time: new Date() })

    await db.collection('users').updateOne(
        { _id: new ObjectId(req.id) },
        { $inc: { answers: 1 } }
    )

    res.json({ success: true, message: "Answer posted!" })
})

router.get('/likes', authMiddleware, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('answers');

    const answer = await collection.findOne({
        _id: new ObjectId(req.query.answerId)
    });

    if (!answer) {
        return res.status(404).json({
            success: false,
            message: "Answer not found"
        });
    }

    if (answer.likedBy?.includes(req.id)) {
        return res.status(400).json({
            success: false,
            message: "Already liked "
        });
    }

    await collection.updateOne(
        { _id: new ObjectId(req.query.answerId) },
        {
            $inc: { likes: 1 },
            $push: { likedBy: req.id }
        }
    );

    res.json({
        success: true,
        message: "Thanks for Feedback!"
    });
});

router.get('/dislikes', authMiddleware, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('answers');

    const answer = await collection.findOne({
        _id: new ObjectId(req.query.answerId)
    });

    if (!answer) {
        return res.status(404).json({
            success: false,
            message: "Answer not found"
        });
    }

    if (answer.dislikedBy?.includes(req.id)) {
        return res.status(400).json({
            success: false,
            message: "Already disliked 👀"
        });
    }

    await collection.updateOne(
        { _id: new ObjectId(req.query.answerId) },
        {
            $inc: { dislikes: 1 },
            $push: { dislikedBy: req.id }
        }
    );

    res.json({
        success: true,
        message: "Thanks for Feedback!"
    });
});

module.exports = router