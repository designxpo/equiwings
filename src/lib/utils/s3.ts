import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

/**
 * Uploads a File object (from formData) directly to S3 using streaming.
 * @param file File object from formData
 * @returns URL of the uploaded file
 */
export async function uploadToS3(file: File): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `assets/${Date.now()}-${file.name}`,
    Body: file.stream(), // ✅ Stream instead of buffering
    ContentType: file.type,
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

/**
 * Deletes a file from S3 given its URL.
 * @param fileUrl Full URL of the file to delete
 */
export async function deleteFromS3(fileUrl: string): Promise<void> {
  const key = fileUrl.split("/").slice(-2).join("/"); // Extract key from URL

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
}
