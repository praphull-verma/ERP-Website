import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/tmp/uploads");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + "_" + Math.round(Math.random() * 1E9);

        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension);

        cb(null, `${name}_${uniqueSuffix}${extension}`);
    },
});

export const upload = multer({ storage });