"use client";

import MainLoader from "@/app/components/MainLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
const getCategoryById = async (categoryId) => {
  const res = await axios.get(`/api/category/${categoryId}`);
  const data = res.data.category.category;
  return data;
};
const EditCategory = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { categoryId } = useParams();
  // console.log(EditCategory);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const {
    data: category,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId),
    staleTime: 0,
  });
  console.log({ category });
  useEffect(() => {
    if (category) {
      setValue("category", category);
    }
  }, [category, setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`/api/category/${categoryId}`, data);
      reset();
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category edited");
      router.push("/all-category");
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) return <MainLoader />;
  if (isError) return <div>Failed to load category</div>;
  return (
    <>
      <h2 className="text-center text-xl text-orange-400">Edit Category</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-primary  mb-1">
            Category
          </label>
          <input
            id="title"
            type="text"
            {...register("category", { required: "Category is required" })}
            className="w-full p-2   rounded-md text-primary
                  border-primary
        
             focus:border-border-secondary 
             outline-none 
                      placeholder-gray-400"
            placeholder="Enter category"
          />
          {errors.category && (
            <span className="text-sm text-red-500">
              {errors.category.message}
            </span>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-2 bg-[#2d4350] hover:bg-[#334a58] transition-all duration-150 text-white font-bold rounded-md cursor-pointer"
        >
          Edit
        </button>
      </form>
    </>
  );
};

export default EditCategory;
