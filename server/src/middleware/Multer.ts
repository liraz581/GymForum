import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return callback(null, true);
        }
        callback(new Error("Only .png, .jpg, and .jpeg formats allowed!"));
    }
});

export default upload;