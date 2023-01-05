const { authenticate } = require("@google-cloud/local-auth");
const path = require('path');
const fs = require('fs');
const { scopes } = require('./constants');
const axios = require('axios');
const mime = require('mime-types');

const authenticator = async () => {
    const { credentials } = await authenticate({
        scopes,
        keyfilePath: path.join(__dirname, 'credentials.json'),
    });
    fs.writeFileSync(path.join(__dirname, 'tokens.json'), JSON.stringify(credentials), 'utf-8');
};

const createAlbum = async albumName => {
    if (fs.existsSync(path.join(__dirname, 'albums', `${albumName}.json`))) return;
    if (!fs.existsSync(path.join(__dirname, 'albums'))) fs.mkdirSync(path.join(__dirname, 'albums'));

    const { data: albumData } = await axios({
        method: 'post',
        headers: {
            'Authorization': `Bearer ${require('./tokens.json').access_token}`
        },
        url: 'https://photoslibrary.googleapis.com/v1/albums',
        data: {
            "album": {
                "title": albumName
            }
        }
    });

    fs.writeFileSync(path.join(__dirname, 'albums', `${albumName}.json`), JSON.stringify(albumData, null, 2), 'utf-8');
};

const getUploadToken = async filePath => {
    const { data: uploadToken } = await axios({
        method: 'post',
        headers: {
            'Authorization': `Bearer ${require('./tokens.json').access_token}`,
            'Content-type': 'application/octet-stream',
            'X-Goog-Upload-Content-Type': mime.contentType(filePath.split('\\').slice(-1)[0]),
            'X-Goog-Upload-Protocol': 'raw',
        },
        url: 'https://photoslibrary.googleapis.com/v1/uploads',
        data: fs.readFileSync(filePath)
    });
    return uploadToken;
}

const publishPhoto = async (description, fileName, uploadToken, albumName) => {
    await axios({
        method: 'post',
        headers: {
            'Authorization': `Bearer ${require('./tokens.json').access_token}`,
        },
        url: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
        data: {
            albumId: require(path.join(__dirname, 'albums', `${albumName}.json`)).id,
            newMediaItems: [
                {
                    description,
                    simpleMediaItem: {
                        fileName,
                        uploadToken
                    }
                }
            ]
        }
    })
}
module.exports = { authenticator, createAlbum, getUploadToken, publishPhoto }