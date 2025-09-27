"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ThreeDots from "../../components/icons/ThreeDots";
import Link from "next/link";
import Image from "next/image";
import MainLoader from "@/app/components/MainLoader";
import { useQuery } from "@tanstack/react-query";
export const getProducts = async () => {
  try {
    const res = await axios.get("/api/product");
    return res.data.product;
  } catch (error) {
    console.log(error);
  }
};
const AllProduct = () => {
  const [actionId, setActionId] = useState(null);
  const popupRefs = useRef({});
  const triggerRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      const isInsideAnyPopup = Object.values(popupRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );

      const isInsideAnyTrigger = Object.values(triggerRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );

      if (!isInsideAnyPopup && !isInsideAnyTrigger) {
        setActionId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const {
    data: products,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000000,
  });

  const handleDeleteProduct = async (id) => {
    try {
       await axios.delete("/api/product", {
        data: { id },
        headers: {
          "Content-Type": "application/json",
        },
      });
      refetch();
      toast.success("Product deleted");
    } catch (error) {
      console.log(error);
    }
  };
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isPreviewImage, setIsPreviewImage] = useState(false);
  console.log({ isPreviewImage });
  if (isLoading) return <MainLoader />;
  if (isError) return <p>Something went wrog while fetching product.</p>;
  return (
    <>
      <div className="w-full relative">
        <h2 className="text-primary text-base md:text-xl font-semibold md:font-normal mb-4 text-center">
          All Products
        </h2>
        <table className="w-full bg-primary text-secondary rounded-lg shadow overflow-x-auto">
          <thead className="border-b border-b-color text-primary font-bold">
            <tr>
              <th className=" px-4.5 py-4 text-left text-xs italic  uppercase tracking-wider">
                S.No
              </th>
              <th className="  px-4.5 py-4 text-left text-xs italic  uppercase tracking-wider">
                Image
              </th>
              <th className="  px-4.5 py-4 text-left text-xs italic  uppercase tracking-wider">
                Title
              </th>
              <th className=" px-4.5 py-4 text-left text-xs italic  uppercase tracking-wider">
                Cateogry
              </th>
              <th className=" px-4.5 py-4 text-center text-xs italic uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-b-color ">
            {products?.map(({ title, categoryId, _id, imageUrl }, i) => {
              return (
                <tr key={_id} className="transition-colors">
                  <td className={` px-4.5 py-3 `}>{i + 1}</td>
                  <td
                    className={` px-4.5 py-3 `}
                    onClick={() => {
                      setIsPreviewImage(true);
                      setPreviewImageUrl(imageUrl);
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt="product"
                      width={400}
                      height={400}
                      className="w-12 h-10"
                    />
                  </td>
                  <td className=" px-4.5 py-3">{title}</td>
                  <td className=" px-4.5 py-3">{categoryId?.category}</td>
                  <td className="relative max-w-[30px] px-4.5 py-3 whitespace-nowrap text-center">
                    <span
                      ref={(el) => (triggerRefs.current[_id] = el)}
                      className="flex justify-center items-center hover:bg-primary py-1 w-5 mx-auto cursor-pointer"
                      onClick={() => {
                        setActionId((prev) => (prev === _id ? null : _id));
                      }}
                    >
                      <ThreeDots />
                    </span>
                    {/* action popup */}
                    <div
                      ref={(el) => (popupRefs.current[_id] = el)}
                      className={`flex flex-col gap-1 w-24 bg-primary border border-border-primary text-primary p-1.5 rounded text-sm absolute right-1/2 transition-all origin-top-right duration-300 ease-in-out shadow-lg z-50 ${
                        actionId == _id ? "scale-100" : "scale-0"
                      }`}
                    >
                      <Link href={`edit-product/${_id}`}>
                        <button className="w-full cursor-pointer hover:bg-secondary px-2 py-2  font-medium  transition-colors">
                          Edit
                        </button>
                      </Link>
                      <button
                        className="w-full cursor-pointer hover:bg-secondary px-2 py-2 font-medium   transition-colors"
                        onClick={() => handleDeleteProduct(_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products?.length == 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                  No Product
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isPreviewImage && (
          <div
            onClick={() => setIsPreviewImage(false)}
            className="fixed inset-0 z-50 flex justify-between items-center w-full bg-black/50 backdrop-blur-xs mx-auto min-h-screen"
          >
            <div className="w-full relative">
              <Image
                src={previewImageUrl}
                alt="product"
                width={400}
                height={400}
                className="w-96 h-[400px] mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllProduct;
