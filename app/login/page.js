"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/login", data);
      localStorage.setItem("admin",res.data.admin)
      console.log(res, "login response");
      setLoading(false);
      reset();
      if (res.status == "200") {
        router.push("/");
        toast.success("Login successful");
      }
    } catch (error) {
      console.log(error, "Error occuried when try to login");
      setLoading(false);
      toast.error(error.response.data.error);
    }
  };
  return (
    <>
      <div className="text-orange-600 text-4xl my-4  ml-4 font-bold  ">
        ShopEase
      </div>
      <div className="flex justify-center items-center  w-full my-40 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4.5 p-5 rounded-2xl shadow w-[400px] bg-primary"
        >
          <h3 className="text-2xl font-bold text-center text-primary">Login</h3>

          <div>
            <input
              type="username"
              className="w-full p-2.5 border border-gray-400 rounded text-sm"
              placeholder="username"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors?.username && (
              <p className="text-red-500 text-sm mt-0.5">
                {errors?.username?.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              className="w-full p-2.5 border border-gray-400 rounded text-sm"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors?.password && (
              <p className="text-red-500 text-sm mt-0.5">
                {errors?.password?.message}
              </p>
            )}
          </div>
          <button className="bg-orange-500 hover:bg-orange-400 text-white p-2.5 w-full rounded cursor-pointer font-bold">
           {loading?"Loading...":"Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
