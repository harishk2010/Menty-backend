import AWS from "aws-sdk";
import { IMulterFile } from "../types/types";
import { S3BucketErrors } from "./constants";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}
export async function uploadToS3Bucket(
  file: IMulterFile,
  folderName: string
): Promise<string> {
  try {
    if (!file) {
      throw new Error(S3BucketErrors.NO_FILE);
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
      throw new Error(S3BucketErrors.ERROR_GETTING_IMAGE);
    }

    return uploadedResult.Location;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
