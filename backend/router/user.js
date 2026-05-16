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

router.get('/', authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('users');

  try {
    const data = await collection.findOne({ _id: new ObjectId(req.id) });
    res.json({ username: data.username, email: data.email, specialty: data.specialty, profilePic: data.profilePic, posts: data.posts, answers: data.answers });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
})

router.post("/profilePic", upload.single("image"), async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('users');

  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  try {
    const file = req.file;

    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (user?.profilePicId) {
      await cloudinary.uploader.destroy(user.profilePicId);
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile_pics" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Upload failed" });
        }

        await collection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              profilePic: result.secure_url,
              profilePicId: result.public_id
            }
          }
        );

        res.json({ imageUrl: result.secure_url });
      }
    );

    stream.end(file.buffer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

