import { ConnectDB } from "@/app/lib/config/DB";
import { NextResponse } from "next/server";
const loadDB = async () => {
  await ConnectDB();
};
loadDB();
export async function POST() {
  try {
    // Create response with cleared cookie
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear token cookie (set to empty with maxAge 0)
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // expires immediately
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
