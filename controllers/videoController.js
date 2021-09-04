const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');

module.exports = {
    handlePlayPage: (req, res) => {
        const vidName = req.params.video;
        res.render('video', {video: vidName});
    },
    handleVideoStreaming: (req, res) => {
        const vidName = req.params.video;
        const filePath = path.join(__dirname, `../public/video/${vidName}.mp4`);
        const range = req.headers.range;
        if(!range){
            res.status(400).send('We need the Range header!');
        }
    
        const chunk = 10 ** 6;
        const videoSize = fs.statSync(filePath).size;
        const start = Number(range.replace(/\D/g, ""))
        const end = Math.min(start + chunk, videoSize - 1);
    
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Range": 'bytes',
            "Content-Length": end - start + 1,
            "Content-Type": 'video/mp4'
        };
    
        res.writeHead(206, headers);
    
        const vidStream = fs.createReadStream(filePath, {start: start, end: end});
    
        vidStream.pipe(res);    
    },
    handleVideoUploadAndThumbnail: (req, res) => {
        const filename = req.file.originalname;
        try {
            new ffmpeg(path.join(__dirname, `../public/video/${filename}`)).then(video => {
                video.fnExtractFrameToJPG(path.join(__dirname, '../public/video/thumbnails'), {
                    frame_rate: 1,
                    number: 1,
                    file_name: filename,
                }, (err, files) => {
                    if(!err){
                        console.log('extracted thumbnails');
                    }
                    console.log(err);
                })
            })
            .catch(err => {
                throw err;
            });
        } catch(err) {
            throw err;
        }
    }
}