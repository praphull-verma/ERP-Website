import { prisma } from "../../lib/prisma";
import { uploadOnCloudinary } from "../../utils/media-upload/cloudinaryUtil";
import type { UploadType } from "../../types/upload.types";
import fs from "fs/promises";

export async function uploadMedia(
    localFilePath: string,
    type: UploadType
) {
    if (!localFilePath) {
        throw new Error("File is required");
    }

    const result = await uploadOnCloudinary(
        localFilePath,
        type
    );

    if (!result) {
        throw new Error("Cloudinary upload failed");
    }

    const media = await prisma.media.create({
        data: {
            assetId: result.asset_id,
            publicId: result.public_id,
            url: result.secure_url,
            filename:result.original_filename,
            type: type.toUpperCase() as "LOGO" | "PROFILE" | "POSTS" | "DOCUMENTS",
        },
    });

    // Remove temporary local file
    await fs.unlink(localFilePath);

    return media;
}