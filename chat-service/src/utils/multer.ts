import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}

const s3 = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.BUCKET_SECERET_ACCESS_KEY!,
  },
});
const getFolderName = (fieldname: string) => {
  let name;
  if (fieldname == "thumbnail") {
    name = "thumbnail";
  } else if (fieldname == "demoVideos") {
    name = "demoVideos";
  } else if (fieldname == "chat") {
    name = "demoVideos";
  } else {
    name = "chapterVideo";
  }
  return name;
};
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME!,
    // acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: async (req, file, cb) => {
      const folder = await getFolderName(file.fieldname);

      cb(null, `${folder}/${Date.now()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

export default upload;
