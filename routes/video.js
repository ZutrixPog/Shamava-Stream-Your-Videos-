const express = require('express');
const multer = require('multer');
const videoController = require('../controllers/videoController');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');

const videoRouter = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/video'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "video/mp4" || file.mimetype == "video/ogg" || file.mimetype == "video/webm"){
        cb(null, true);
    } else {
        cb(null, false)
    }
}

videoRouter.get('/play/:video', videoController.handlePlayPage);

videoRouter.get('/video/:video', videoController.handleVideoStreaming);

videoRouter.get('/upload', (req, res) => {
    res.render('upload');
});

videoRouter.post("/upload", multer({ storage: fileStorage, fileFilter: fileFilter }).single('video'), videoController.handleVideoUploadAndThumbnail);

module.exports = videoRouter;