import multer from "multer";
export interface MulterRequest extends Request {
    files?: {
      degreeCertificate?: File[];
      resume?: File[];
    };
  }

export interface IMulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // Set file size limit to 100 MB
  },
});
export default upload;
