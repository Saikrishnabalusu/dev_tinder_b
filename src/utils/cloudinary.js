const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        // upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        // successfully uploaded to cloudinary, now delete the file from local storage
        fs.unlinkSync(filePath);
        console.log("File uploaded to Cloudinary:", result.url);
        // return result.url; // return the URL of the uploaded file

        return result;
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // delete the file from local storage
        }
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
}

module.exports = { uploadOnCloudinary }