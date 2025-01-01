import { connectMongoDB } from "../../../../lib/mongodb";
import Filedata from "../../../../models/filedata";
const { NextResponse } = require("next/server");

export async function POST(req) {
  try {
    const { word } = await req.json();
    const regex = new RegExp(word, 'i');

    await connectMongoDB();
    const fileData = await Filedata.find({
        $or: [
            { name: regex }, 
            { detail: regex } 
        ]
    }); 

    return NextResponse.json({ fileData });
  } catch (error) {
    return NextResponse.json(
      {
        message: "ERROR finding data",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
