import { ConnectDB } from "@/app/lib/config/DB";
import { Category } from "@/app/lib/model/Category.model";
import Product from "@/app/lib/model/Product.model";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();
export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category)
      return NextResponse.json(
        { message: "Category id not exist" },
        { status: 404 }
      );
    const product = await Product.find({ categoryId: id }).populate("categoryId","category");
    return NextResponse.json(
      { message: "Get Product", product },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
