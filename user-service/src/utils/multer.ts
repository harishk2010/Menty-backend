import multer from "multer";

const storage= multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 100, // Set file size limit to 100 MB
    }
});
export default upload