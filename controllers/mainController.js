const fs = require('fs');
const path = require('path');

const mainController = async function(req, res) {
    const files = await fs.readdirSync(path.join(__dirname, '../public/video'), {withFileTypes: true});
    const videos = files.filter(file => file.isFile()).map(file => 
        ({
            name: file.name,
            thumbnail: `/video/thumbnails/${file.name.split('.')[0]}_1.jpg`, 
        }));
    console.log(videos);
    res.render('index.ejs', {videos: videos});
}

module.exports = mainController;