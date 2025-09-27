import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import User from "@/app/lib/model/User.model";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = payload.id;
   const user = await User.findById(userId).select("-password")
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
