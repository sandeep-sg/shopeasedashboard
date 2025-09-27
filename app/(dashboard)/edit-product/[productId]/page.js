"use client";

import Input from "@/app/components/Input";
import MainLoader from "@/app/components/MainLoader";
import Select from "@/app/components/Select";
import Textarea from "@/app/components/Textarea";
import { productSize } from "@/app/constant/productSize";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getCategories } from "../../all-category/page";
const getProductById = async (productId) => {
  const res = await axios.get(`/api/product/${productId}`);
  return res.data.product;
};
const EditProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { productId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    staleTime: 0,
  });
  console.log({ product });
  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description);
      setValue("category", product.categoryId._id);
      setValue("sellingPrice", product.sellingPrice);
      setValue("netPrice", product.netPrice);
      setValue("size", product.size);
    }
  }, [product, setValue]);
  const { data: categories, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000000,
  });
  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`/api/product/${productId}`, data);
      reset();
      toast.success(<span>{res?.data?.message}</span>);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/all-product");
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading || isCategoryLoading) return <MainLoader />;
  if (isError) return <div>Failed to load product</div>;

  return (
    <>
      <h2 className="text-center text-xl text-orange-400">Edit Product</h2>
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
          isRequired={false}
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
          {isSubmitting ? "Updating..." : "Edit Product"}
        </button>
      </form>
    </>
  );
};

export default EditProduct;
