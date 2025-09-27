import { ConnectDB } from "@/app/lib/config/DB";
import Cart from "@/app/lib/model/Cart";
import CartItem from "@/app/lib/model/CartItem";
import { NextResponse } from "next/server";

const dbLoad = async () => {
  await ConnectDB();
};
dbLoad();
export async function POST(req) {
  try {
    const { userId, productId, size, quantity } = await req.json();
    if (!userId || !productId || !size || !quantity) {
      return NextResponse.json(
        { message: "userid,productId,size and quantity is required" },
        { status: 404 }
      );
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
      });
    }
    console.log({ cart });
    const cartItem = await CartItem.create({
      cart: cart._id,
      product: productId,
      size,
      quantity: quantity || 1,
    });
    console.log({ cartItem });
    return NextResponse.json(
      { message: "Product add in cart", cartItem },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

