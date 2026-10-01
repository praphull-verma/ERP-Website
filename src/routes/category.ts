import { uploadMedia } from "./media/upload";
import { prisma } from "../lib/prisma";

export async function createCategory(
    name: string,
    resourceCount: number,
    localFilePath: string
) {
    const media = await uploadMedia(
        localFilePath,
        "category"
    );

    try {
        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                resourceCount,
                imageId: media.id,
            },
            include: {
                image: true,
            },
        });

        return category;
    } catch (error) {
        // Ideally clean up the uploaded media in Cloudinary
        // if database creation fails.
        throw error;
    }
}