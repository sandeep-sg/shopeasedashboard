import { NextResponse } from "next/server";
import { ConnectDB } from "../../lib/config/DB";
import Product from "@/app/lib/model/Product.model";
import cloudinary from "@/app/lib/cloudinary";
import mongoose from "mongoose";
import { Category } from "@/app/lib/model/Category.model";
const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();
export async function GET() {
  try {
    const product = await Product.find().populate("categoryId", "category");
    return NextResponse.json({ product: product, message: "Product Get" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const netPrice = formData.get("netPrice");
    const sellingPrice = formData.get("sellingPrice");

    let size = formData.get("size");
    try {
      size = JSON.parse(size); // convert from JSON string to array
    } catch {
      size = [size]; // ensure it's still an array if parsing fails
    }

    const image = formData.get("product_image");
    if (!title || !description || !image) {
      return NextResponse.json(
        { message: "Product image is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    const product = await Product.create({
      title,
      description,
      categoryId: new mongoose.Types.ObjectId(category),
      netPrice,
      sellingPrice,
      imageUrl: cloudinaryResponse.secure_url,
      size,
    });

    return NextResponse.json(
      {
        message: "Product created.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ message: "Product id is empty" });
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product Deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
