import { IncomingForm } from 'formidable';
import cloudinary from "../../../../lib/cloudinary";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    // Convert the request to a Node.js readable stream
    const data = await req.formData();
    const file = data.get('file');
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create temporary file with unique name
    const tempDir = os.tmpdir();
    const uniqueFilename = `upload-${Date.now()}-${file.name}`;
    const tempFilePath = join(tempDir, uniqueFilename);
    
    // Write the file to temporary directory
    await writeFile(tempFilePath, buffer);

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
      folder: "nextjs_uploads",
    });

    return NextResponse.json({ 
      url: uploadResponse.secure_url 
    }, { 
      status: 200 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: "Failed to upload file" 
    }, { 
      status: 500 
    });
  }
}