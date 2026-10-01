import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { UploadType } from '../../types/upload.types';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath: string,
    type: UploadType) => {
    try {
        if (!localFilePath) {
            return null;
        }

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
                folder: type,
            })
        console.log("File has been uploaded succesfully with url", response.url);
        console.log(response);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}


export { uploadOnCloudinary }

