import { ConnectDB } from "@/app/lib/config/DB";
import { Category } from "@/app/lib/model/Category.model";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

export async function POST(request) {
  const { category, subCategory } = await request.json();
  try {
    const categories = await Category.create({
      category,
      subCategory,
    });
    return NextResponse.json({
      categories: categories,
      messaeg: "Category created",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
export async function GET() {
  try {
    const category = await Category.find();
    return NextResponse.json({ category, message: "Category get" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
export async function DELETE(request) {
  const id = await request.json();
  try {
    if (!id) {
      return NextResponse.json(
        { message: "Id does not exist" },
        { status: 404 }
      );
    }
    const category = await Category.findByIdAndDelete(id);
    return NextResponse.json({ category, message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
