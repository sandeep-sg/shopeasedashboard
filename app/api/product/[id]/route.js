import Product from "@/app/lib/model/Product.model";
import { ConnectDB } from "@/app/lib/config/DB";
import { NextResponse } from "next/server";
import { Category } from "@/app/lib/model/Category.model";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "Id not exist" });
    }
    const product = await Product.findById(id).populate(
      "categoryId",
      "category"
    );
    return NextResponse.json({ product: product, messsage: "Product Get" });
  } catch (error) {
    return NextResponse.json({ messsage: error });
  }
}

export async function PUT(req, { params }) {
  try {
    const newData = await req.json();
    const { id } = await params;
    const product = await Product.findByIdAndUpdate(id, newData);
    return NextResponse.json({ product: product, message: "Product Updated" });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
