const fs = require('fs');
const path = require('path');
const { createAlbum, getUploadToken, authenticator, publishPhoto } = require("./utils");

const uploadPhoto = async (dir, albumName, filesDetails) => {
    await authenticator();
    await createAlbum(albumName);
    const newMediaItems = [];
    for (const file of filesDetails) {
        const filePath = path.join(dir, file.fileName);
        const uploadToken = await getUploadToken(filePath);
        newMediaItems.push({
            description: file.desc || file.fileName,
            simpleMediaItem: {
                fileName: file.fileName,
                uploadToken
            }
        });
    }
    await publishPhoto(newMediaItems, albumName);

}

module.exports = { uploadPhoto }







