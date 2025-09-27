import { ConnectDB } from "@/app/lib/config/DB";
import { Category } from "@/app/lib/model/Category.model";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();
export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const category = await Category.findById(id);
    return NextResponse.json({
      messaeg: "Category Get",
      category,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    console.log(body,"catgory body")

    const updatedProduct = await Category.findByIdAndUpdate(id, body, {
      new: true, // return updated document
      runValidators: true,
    });

    return NextResponse.json({ message: "Category Updated", product: updatedProduct });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
