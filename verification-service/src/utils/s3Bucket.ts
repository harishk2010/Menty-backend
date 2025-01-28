import AWS from "aws-sdk";
import { IMulterFile } from "../utils/multer";

export async function uploadToS3Bucket(
  file: IMulterFile,
  folderName: string
): Promise<string> {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const params: any = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${folderName}s/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    //   ACL: "public-read",
    };

    AWS.config.update({
      accessKeyId: process.env.BUCKET_ACCESS_KEY,
      secretAccessKey: process.env.BUCKET_SECERET_ACCESS_KEY,
      region: process.env.BUCKET_REGION,
    });

    const s3 = new AWS.S3();

    const uploadedResult = await s3.upload(params).promise();
    if (!uploadedResult) {
      throw new Error("Error gettting the image from S# Bucket!!!");
    }

    return uploadedResult.Location;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
