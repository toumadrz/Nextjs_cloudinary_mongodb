import { connectMongoDB } from "../../../../lib/mongodb";
import Filedata from "../../../../models/filedata";
const { NextResponse } = require("next/server");

export async function POST(req) {
  try {
    const { docId,name,detail,category,linkFile, } = await req.json();

    await connectMongoDB();
    const res = await Filedata.findByIdAndUpdate(docId, {
        name: name,
        detail: detail,
        category: category,
        linkFile: linkFile,
    }, { new: true }); 

    return NextResponse.json({ res });
  } catch (error) {
    return NextResponse.json(
      {
        message: "ERROR finding document data",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
