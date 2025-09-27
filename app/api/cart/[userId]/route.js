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
        { status: 404 }
      );
    }
    const { _id } = await Cart.findOne({ user: userId });
    console.log({ _id });
    const cart = await CartItem.find({ cart: _id }).populate("product");
    console.log({ cart });
    return NextResponse.json(
      { message: "Cart fetch successfully", cart },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
