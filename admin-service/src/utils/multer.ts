import multer,{ FileFilterCallback } from "multer";
import {Response ,Request} from "express"
import path from 'path';
// export interface MulterRequest extends Request {
//     files?: {
//       degreeCertificate?: File[];
//       resume?: File[];
//     };
//   }

export interface IMulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

function checkFileType(file: Express.Multer.File, cb: FileFilterCallback): void {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
  const isFileTypeValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeTypeValid = allowedTypes.test(file.mimetype);

  if (isFileTypeValid && isMimeTypeValid) {
      cb(null, true);
  } else {
      cb(new Error('Error: Only images (jpeg, jpg, png, gif) and videos (mp4, mov) are allowed!'));
  }
}

const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024 * 100, // Set file size limit to 100 MB
//   },
// });
const upload = multer({
  storage,
  limits: {
      fileSize: 1024 * 1024 * 100, // Set file size limit to 100 MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      console.log('Uploading file:', file.originalname);
      checkFileType(file, cb);
  },
});
export default upload;
