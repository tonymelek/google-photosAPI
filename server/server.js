const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mime = require('mime-types');
const { uploadPhoto } = require('./main');
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(express.json());

app.get('/file/:fileName', (req, res) => {
    res.sendFile(`${req.query.baseUrl}\\${req.params.fileName}`)
})
app.get('/photos', (req, res) => {
    const images = fs.readdirSync(req.query.baseUrl).filter(fileName => /image/i.test(mime.contentType(fileName)));
    res.send(images)
});

app.post('/upload', async (req, res) => {
    const album = req.query.albumName;
    const dir = req.query.baseUrl;
    await uploadPhoto(dir, album, req.body);
    res.send(req.body);
})

app.listen(5000, () => console.log(` server is now up and running on port 5000`))