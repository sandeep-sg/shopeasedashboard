import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "@/app/lib/model/Admin.model";
import { ConnectDB } from "@/app/lib/config/DB";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const admin = await Admin.findOne({ username });
    console.log({ admin });
    if (!admin) {
      return NextResponse.json(
        { error: "Invaild credentail" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    // Create JWT with user ID
    const token = jwt.sign({ id: admin._id }, SECRET_KEY, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successfull",
      admin: admin.username,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
