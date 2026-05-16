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

const storage = multer.memoryStorage();
const upload = multer({ storage })

router.use(express.json())

router.post('/', upload.single("file"), authMiddleware, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('problems');
    const data = req.body;
    const file = req.file;

    let problemPic = null;
    let problemPicId = null;

    if (file) {
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "problem_pics" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            stream.end(file.buffer);
        });

        problemPic = uploadResult.secure_url;
        problemPicId = uploadResult.public_id;
    }
    const result = await collection.insertOne({ userId: req.id, title: data.title, description: data.description, mode: data.mode, problemPic: problemPic, problemPicId: problemPicId })

    await db.collection('users').updateOne(
        { _id: new ObjectId(req.id) },
        { $inc: { posts: 1 } }
    )

    res.json({ success: true, message: "Problem posted!" })
})

module.exports = router