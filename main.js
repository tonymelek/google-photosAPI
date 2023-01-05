const fs = require('fs');
const path = require('path');
const { createAlbum, getUploadToken, authenticator, publishPhoto } = require("./utils");

const uploadPhoto = async () => {
    const albumName = 'Madame Toussouds';
    const dir = "C:\\Users\\tonyn\\OneDrive\\Pictures\\Madame Toussouds";
    await authenticator();
    await createAlbum(albumName);
    const files = fs.readdirSync(dir);
    for (const fileName of files) {
        const filePath = path.join(dir, fileName);
        const uploadToken = await getUploadToken(filePath);
        await publishPhoto(fileName, fileName, uploadToken, albumName);
    }

}

uploadPhoto();







