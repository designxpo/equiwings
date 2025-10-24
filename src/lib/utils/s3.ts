// lib/utils/s3.ts
import AWS from "aws-sdk"

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

// Keep existing upload function for backward compatibility
export async function uploadToS3(file: Buffer, fileName: string, contentType: string): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `assets/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
  }

  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw error
  }
}

// NEW: Generate presigned URL for direct client upload
export async function generatePresignedUrl(
  fileName: string,
  fileType: string,
  expiresIn: number = 300 // 5 minutes
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
  const key = `assets/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    Expires: expiresIn,
  }

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params)
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    return { uploadUrl, fileUrl, key }
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    throw error
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  // Extract key from full S3 URL
  const key = fileUrl.split("/").slice(-2).join("/")

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  }

  try {
    await s3.deleteObject(params).promise()
  } catch (error) {
    console.error("Error deleting from S3:", error)
    throw error
  }
}