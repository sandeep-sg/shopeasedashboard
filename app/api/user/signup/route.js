import User from "@/app/lib/model/User.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const { ConnectDB } = require("@/app/lib/config/DB");
import jwt from "jsonwebtoken";
const loadDb = async () => {
  await ConnectDB();
};
loadDb();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    console.log(username);
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Fileds are missing" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return NextResponse.json(
        { message: "user already exist" },
        { status: 400 }
      );
    }
    const encryptPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: encryptPassword,
    });
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, {
      expiresIn: "1d",
    });
    console.log({ token });
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: { userId: newUser._id, username: newUser.username, email: newUser.email },
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // 👈 important
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "server error" });
  }
}
