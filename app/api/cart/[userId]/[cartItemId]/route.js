import CartItem from "@/app/lib/model/CartItem";
import { NextResponse } from "next/server";

import { ConnectDB } from "@/app/lib/config/DB";

const dbConnect = async () => {
  await ConnectDB();
};
dbConnect();
export async function DELETE(_, { params }) {
  const { cartItemId } = await params;
  if (!cartItemId)
    return NextResponse.json(
      { message: "cartItem id is required" },
      { status: 404 }
    );
  try {
    const cartItem = await CartItem.findByIdAndDelete(cartItemId);
    return NextResponse.json({
      message: "CartItem delete successfully",
      cartItem,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
