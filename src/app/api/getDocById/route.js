import { connectMongoDB } from "../../../../lib/mongodb";
import Filedata from "../../../../models/filedata";
const { NextResponse } = require("next/server");

export async function POST(req) {
  try {
    const { Id } = await req.json();

    await connectMongoDB();
    const fileData = await Filedata.findById(Id)

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
