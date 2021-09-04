const express = require('express');
const videoRouter = require('./routes/video.js');
const path = require('path');

const mainController = require('./controllers/mainController.js');

const app = express();

app.use(express.static(path.join(__dirname, './public')));
app.set('view engine', 'ejs');
app.set('views', 'views')

app.get('/', mainController);

app.use(videoRouter);

app.listen("8000", () => {
    console.log("Server up and running!!");
})