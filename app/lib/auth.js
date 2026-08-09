import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function protectRoute() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Not authenticated",
      };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return {
      success: true,
      userId: decoded.id,
    };
  } catch (error) {
    console.error("Auth error:", error);

    return {
      success: false,
      status: 401,
      message: "Invalid or expired token",
    };
  }
}