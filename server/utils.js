const { authenticate } = require("@google-cloud/local-auth");
const path = require('path');
const fs = require('fs');
const { scopes } = require('./constants');
const axios = require('axios');
const mime = require('mime-types');

const needsAuthentication = () => {
    const { expiry_date: expiryDate } = fs.readFileSync(path.join(__dirname, '..', 'tokens.json')) || { expiry_date: 0 };
    return expiryDate < new Date().getTime();
}
const authenticator = async () => {
    if (!needsAuthentication) return;
    const { credentials } = await authenticate({
        scopes,
        keyfilePath: path.join(__dirname, 'credentials.json'),
    });
    fs.writeFileSync(path.join(__dirname, '..', 'tokens.json'), JSON.stringify(credentials), 'utf-8');
};

const getAlbumContents = async albumName => {
    const albums = require('../albums.json');
    const { id: albumId } = albums.find(album => albumName === album.title);
    const { data: { mediaItems } } = await axios({
        method: 'post',
        headers: {
            'Authorization': `Bearer ${require('../tokens.json').access_token}`
        },
        url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
        data: {
            albumId
        }

    });
    fs.writeFileSync(path.join(__dirname, '..', 'albums.json'), JSON.stringify(albums, null, 2), 'utf-8')
}
const getAlbums = async () => {
    const { data: { albums } } = await axios({
        method: 'get',
        headers: {
            'Authorization': `Bearer ${require('../tokens.json').access_token}`
        },
        url: 'https://photoslibrary.googleapis.com/v1/albums?excludeNonAppCreatedData=true'
    });
    fs.writeFileSync(path.join(__dirname, '..', 'albums.json'), JSON.stringify(albums, null, 2), 'utf-8')
}

const createAlbum = async albumName => {
    const albums = require('../albums.json');
    if (albums.find(album => albumName === album.title)) return;
    await axios({
        method: 'post',
        headers: {
            'Authorization': `Bearer ${require('../tokens.json').access_token}`
        },
        url: 'https://photoslibrary.googleapis.com/v1/albums',
        data: {
            "album": {
                "title": albumName
            }
        }
    });
    await getAlbums();
};

const getUploadToken = async filePath => {
    const { data: uploadToken } = await axios({
        method: 'post',
        headers: {
            'Authorization': `Bearer ${require('../tokens.json').access_token}`,
            'Content-type': 'application/octet-stream',
            'X-Goog-Upload-Content-Type': mime.contentType(filePath.split('\\').slice(-1)[0]),
            'X-Goog-Upload-Protocol': 'raw',
        },
        url: 'https://photoslibrary.googleapis.com/v1/uploads',
        data: fs.readFileSync(filePath)
    });
    return uploadToken;
}

const publishPhoto = async (newMediaItems, albumName) => {
    const albums = require('../albums.json');
    const album = albums.find(album => albumName === album.title);
    const contents = await getAlbumContents(albumName);
    console.log(contents);
    // await axios({
    //     method: 'post',
    //     headers: {
    //         'Authorization': `Bearer ${require('../tokens.json').access_token}`,
    //     },
    //     url: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
    //     data: {
    //         albumId: album.id,
    //         newMediaItems
    //     }
    // })
}
module.exports = { authenticator, createAlbum, getUploadToken, publishPhoto, getAlbums }