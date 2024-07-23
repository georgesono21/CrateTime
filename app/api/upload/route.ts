import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize the S3 client with environment variables
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  }
});

// Function to upload a file to S3
async function uploadFileToS3(file: Buffer, fileName: string, folder: string, contentType: string) {
  console.log(`${fileName}, ${process.env.AWS_S3_BUCKET_NAME}`);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${folder}/${fileName}`, // Specify the folder path here
    Body: file,
    ContentType: contentType // Dynamically set the content type
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    return `${folder}/${fileName}`; // Return the file path in S3
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Error uploading file to S3");
  }
}

// Handler for POST requests
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "application/octet-stream"; // Default content type if not specified
    const filePath = await uploadFileToS3(buffer, file.name, folder, contentType);

    // Encode the file path to handle spaces and special characters
    const encodedFilePath = encodeURIComponent(filePath).replace(/%2F/g, '/'); // Keep '/' character
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${encodedFilePath}`;

    console.log(`S3 URL: ${s3Url}`);

    return NextResponse.json({ success: true, s3Url });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: "Error processing the request." }, { status: 500 });
  }
}
