import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
const { NextResponse } = require("next/server");

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectMongoDB();
    const user = await User.findOne({ email }).select("_id");

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        message: "ERROR finding user",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
