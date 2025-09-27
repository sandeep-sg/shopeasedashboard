"use client";
import React from "react";
import { productSize } from "@/app/constant/productSize";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getCategories } from "../all-category/page";
import { useQuery } from "@tanstack/react-query";
import MainLoader from "@/app/components/MainLoader";
import { getProducts } from "../all-product/page";
import Input from "@/app/components/Input";
import Textarea from "@/app/components/Textarea";
import Select from "@/app/components/Select";

const AddProduct = () => {
  const router = useRouter();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000000,
  });
  console.log({ categories });
  const { refetch: productRefetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000000,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    shouldFocusError: true, // 👈 auto focus on first invalid field
  });
  const onSubmit = async (product) => {
    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("netPrice", product.netPrice);
      formData.append("sellingPrice", product.sellingPrice);
      formData.append("size", JSON.stringify(product.size));
      if (product.product_image && product.product_image[0]) {
        formData.append("product_image", product.product_image[0]); // Ensure the file object is used
      }
      const { data } = await axios.post("/api/product", formData);
      reset();
      productRefetch();
      toast.success("Product added");
      router.push("/all-product");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <MainLoader />;
  return (
    <>
      <h2 className="text-center text-xl text-primary">Add Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Input */}
        <Input
          name="title"
          label="Title"
          type="text"
          errorMessage="Title is required"
          register={register}
          placeholder="Enter title"
          errors={errors}
          isRequired={true}
        />
        {/* Description Input */}
        <Textarea
          name="description"
          label="Description"
          errorMessage="Description is required"
          register={register}
          placeholder="Enter description"
          errors={errors}
        />
        {/* category */}
        <Select
          label={"Category"}
          name="category"
          register={register}
          errorMessage={"Category is required"}
          errors={errors}
          options={categories}
        />
        {/* image */}
        <Input
          name="product_image"
          type="file"
          label="Product image"
          errorMessage="Product image is required"
          errors={errors}
          placeholder="Select image"
          register={register}
          isRequired={true}
        />
        {/*net price */}
        <Input
          name="netPrice"
          type="number"
          label="Net price"
          errorMessage="Net price is required"
          errors={errors}
          placeholder="Enter net price"
          register={register}
          isRequired={true}
        />
        {/* sellingPrice */}
        <Input
          name="sellingPrice"
          type="number"
          label="Selling price"
          errorMessage="Selling price is required"
          errors={errors}
          placeholder="Enter selling price"
          register={register}
          isRequired={true}
        />
        {/* color */}
        <div>
          <label htmlFor="size" className="block text-primary mb-1">
            Select size
          </label>
          <div className="w-full flex gap-2  rounded-md text-primary ">
            {productSize?.map((size, index) => {
              return (
                <div
                  key={index}
                  className="relative border border-border-primary flex items-center justify-center  rounded  "
                >
                  {" "}
                  <input
                    type="checkbox"
                    id={index}
                    value={size}
                    {...register("size", {
                      required: "At least one size is required",
                    })}
                    className="hidden w-full peer"
                  />
                  <label
                    htmlFor={index}
                    className="peer-checked:bg-border-secondary peer-checked:text-white  text-center py-1.5 px-3 rounded"
                  >
                    {size}
                  </label>
                </div>
              );
            })}
          </div>
          {errors.size && (
            <span className="text-sm text-red-500">{errors.size.message}</span>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-2 text-orange transition-all duration-150 border rounded-md cursor-pointer"
        >
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </>
  );
};

export default AddProduct;
