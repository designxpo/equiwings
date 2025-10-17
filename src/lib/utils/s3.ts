// lib/utils/s3.ts
import AWS from "aws-sdk"

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

// For small files that go through the API
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

// Generate presigned URL for direct browser upload
export async function getPresignedUploadUrl(
  fileName: string, 
  contentType: string
): Promise<{ url: string; key: string; fullUrl: string }> {
  const key = `assets/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    Expires: 3600, // URL expires in 1 hour
  }

  try {
    const url = await s3.getSignedUrlPromise('putObject', params)
    const fullUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    
    return { url, key, fullUrl }
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    throw error
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
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