import { ConnectDB } from "@/app/lib/config/DB";
import Cart from "@/app/lib/model/Cart";
import CartItem from "@/app/lib/model/CartItem";
import { NextResponse } from "next/server";
import Product from "@/app/lib/model/Product.model";
const dbLoad = async () => {
  await ConnectDB();
};
dbLoad();
export async function GET(_, { params }) {
  try {
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { message: "userid is required" },
        { status: 404 },
      );
    }
    const cartData = await Cart.findOne({
      user: userId,
    });

    if (!cartData) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
          cart: [],
        },
        { status: 404 },
      );
    }

    const cart = await CartItem.find({
      cart: cartData._id,
    }).populate("product");

    return NextResponse.json(
      {
        success: true,
        message: "Cart fetched successfully",
        cart,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart",
      },
      { status: 500 },
    );
  }
}
