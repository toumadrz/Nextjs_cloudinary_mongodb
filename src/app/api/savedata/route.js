import { connectMongoDB } from '../../../../lib/mongodb';
import Filedata from "../../../../models/filedata";
const { NextResponse } = require("next/server");

export async function POST(req) {
    try {
        const { name, detail, category, linkFile, emailUploader } = await req.json();

        await connectMongoDB();
        const UploadData = await Filedata.create({ name, detail, category, linkFile, emailUploader })

        return NextResponse.json(
            {
              message: "Upload completed successfully.",
              data:{
                UploadData
              }
            },
            {
              status: 201,
            }
          );

    } catch (error) {
        return NextResponse.json(
            {
              message: "ERROR upload file",
              error:error.message
            },
            {
              status: 500,
            }
          );
    }
}