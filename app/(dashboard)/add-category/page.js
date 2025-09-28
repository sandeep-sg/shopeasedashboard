"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getCategories } from "../all-category/page";
import Input from "@/app/components/Input";

const AddCategory = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { refetch: categoryRefetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000000,
  });
  const onSubmit = async (data) => {
    console.log(data);
    try {
       await axios.post("/api/category", data);
      reset();
      categoryRefetch();
      toast.success("Category added");
      router.push("/all-category");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="text-center text-xl text-primary">Add Category</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
       <Input
          name="category"
          label="Category"
          type="text"
          errorMessage="Category is required"
          register={register}
          placeholder="Enter category"
          errors={errors}
          isRequired={true}
        />
        <button
          type="submit"
          className="px-6 py-2 text-orange transition-all duration-150 border rounded-md cursor-pointer"
        >
          {isSubmitting ? "Adding..." : "Add Category"}
        </button>
      </form>
    </>
  );
};

export default AddCategory;
