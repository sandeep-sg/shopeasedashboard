import User from "@/app/lib/model/User.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ConnectDB } from "@/app/lib/config/DB";
const loadDb = async () => {
  await ConnectDB();
};
loadDb();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Fileds are missing" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentail" },
        { status: 404 }
      );
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return NextResponse.json({ message: "Password wrong" }, { status: 401 });
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1d",
    });
    const response = NextResponse.json(
      {
        message: "Login successfull",
        user: { userId: user._id, username: user.username, email: user.email },
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
