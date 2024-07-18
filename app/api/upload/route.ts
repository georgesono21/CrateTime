import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
    }
});

async function uploadFileToS3(file: Buffer, fileName: string, folder: string) {
    const fileBuffer = file;
    console.log(`${fileName}, ${process.env.AWS_S3_BUCKET_NAME}`);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folder}/${fileName}`, // Specify the folder path here
        Body: fileBuffer,
        ContentType: "image/jpg"
    }

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `${folder}/${fileName}`; // Return the file path in S3
}

export async function POST(request: { formData: () => any; }) {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!file) {
        return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = await uploadFileToS3(buffer, file.name, folder); // Pass the folder name here

    // Encode the file path to handle spaces and special characters
    const encodedFilePath = encodeURIComponent(filePath).replace(/%2F/g, '/'); // Keep '/' character
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${encodedFilePath}`;

    console.log(`S3 URL: ${s3Url}`);

    return NextResponse.json({ success: true, s3Url });
}

