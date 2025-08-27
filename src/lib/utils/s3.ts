// import AWS from "aws-sdk"

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// })

const BUCKET_NAME = process.env.S3_BUCKET_NAME!

export async function uploadToS3(file: Buffer, fileName: string, contentType: string): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `products/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
    ACL: "public-read",
  }

  try {
    // const result = await s3.upload(params).promise()
    // return result.Location
    return 'dummy link'
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw error
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  const key = fileUrl.split("/").slice(-2).join("/") // Extract key from URL

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  }

  try {
    // await s3.deleteObject(params).promise()
  } catch (error) {
    console.error("Error deleting from S3:", error)
    throw error
  }
}
