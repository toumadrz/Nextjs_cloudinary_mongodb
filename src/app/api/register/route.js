import { connectMongoDB } from '../../../../lib/mongodb';
import User from "../../../../models/user";
const { NextResponse } = require("next/server");
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password,10)

    await connectMongoDB()
    const user = await User.create({ name, email, password:hashedPassword })

    return NextResponse.json(
      {
        message: "Register completed successfully",
        data:{
          user
        }
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "ERROR register user",
        error:error.message
      },
      {
        status: 500,
      }
    );
  }
}
