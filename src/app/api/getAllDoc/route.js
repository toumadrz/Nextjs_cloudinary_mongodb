import { connectMongoDB } from "../../../../lib/mongodb";
import Filedata from "../../../../models/filedata";
const { NextResponse } = require("next/server");

export async function GET(req) {
  try {

    await connectMongoDB();
    const fileData = await Filedata.find();
    console.log("= ",fileData)
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
