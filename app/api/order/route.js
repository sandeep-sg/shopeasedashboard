import { NextResponse } from "next/server";
import { ConnectDB } from "@/app/lib/config/DB";
import { protectRoute } from "@/app/lib/auth";
import Order from "@/app/lib/model/Order.model";
import User from "@/app/lib/model/User.model";
import Product from "@/app/lib/model/Product.model";
import Cart from "@/app/lib/model/Cart";
import CartItem from "@/app/lib/model/CartItem";
const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();
export async function POST(request) {
  try {
    // -----------------------------
    // Protect route
    // -----------------------------

    const auth = await protectRoute();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        },
      );
    }

    const userId = auth.userId;

    // -----------------------------
    // Request body
    // -----------------------------

    const { address, paymentMethod = "cod" } = await request.json();

    // -----------------------------
    // Validate address
    // -----------------------------

    // if (
    //   !address?.name ||
    //   !address?.phone ||
    //   !address?.addressLine ||
    //   !address?.city ||
    //   !address?.state ||
    //   !address?.postalCode
    // ) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Complete address is required.",
    //     },
    //     { status: 400 },
    //   );
    // }

    // -----------------------------
    // Find user's cart
    // -----------------------------

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found.",
        },
        { status: 404 },
      );
    }

    // -----------------------------
    // Get cart items
    // -----------------------------

    const cartItems = await CartItem.find({
      cart: cart._id,
    }).populate("product");

    if (!cartItems.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty.",
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // Check products
    // -----------------------------

    for (const item of cartItems) {
      if (!item.product) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more products no longer exist.",
          },
          { status: 400 },
        );
      }
    }

    // -----------------------------
    // Create order items
    // -----------------------------

    const items = cartItems.map((item) => ({
      product: item.product._id,
      size: item.size,
      quantity: item.quantity,
      price: item.product.sellingPrice,
    }));

    // -----------------------------
    // Calculate total
    // -----------------------------

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.product.sellingPrice * item.quantity,
      0,
    );

    // -----------------------------
    // Create order
    // -----------------------------

    const order = await Order.create({
      user: userId,
      items,
      address,
      totalAmount,
      paymentMethod,
    });

    await order.populate("items.product", "name price image");

    // -----------------------------
    // Clear cart
    // -----------------------------

    await CartItem.deleteMany({
      cart: cart._id,
    });

    // -----------------------------
    // Response
    // -----------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully.",
        data: order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order.",
      },
      { status: 500 },
    );
  }
}

// export async function GET() {
//   try {
//     // -----------------------------
//     // Protect route
//     // -----------------------------

//     const auth = await protectRoute();

//     if (!auth.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: auth.message,
//         },
//         {
//           status: auth.status,
//         },
//       );
//     }

//     const userId = auth.userId;

//     // -----------------------------
//     // Get user's orders
//     // -----------------------------

//     const orders = await Order.find({
//       user: userId,
//     })
//       .populate("items.product", "name price image")
//       .sort({
//         createdAt: -1,
//       });

//     return NextResponse.json({
//       success: true,
//       data: orders,
//     });
//   } catch (error) {
//     console.error("Get orders error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch orders.",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

export async function GET() {
  try {
    // Protect route
    const auth = await protectRoute();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status },
      );
    }

    // Get all orders
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product", "name price image")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders.",
      },
      { status: 500 },
    );
  }
}
