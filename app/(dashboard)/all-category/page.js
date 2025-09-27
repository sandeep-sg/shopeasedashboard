"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";
import ThreeDots from "../../components/icons/ThreeDots";
import Link from "next/link";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import MainLoader from "@/app/components/MainLoader";
export const getCategories = async () => {
  try {
    const res = await axios.get("/api/category");
    return res.data.category;
  } catch (error) {
    console.log(error);
  }
};
const AllCategory = () => {
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
    data: categories,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000000,
  });
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete("/api/category", {
        data: id,
        headers: {
          "Content-Type": "application/json", // optional, but safe
        },
      });
      toast.success("Category deleted");
      console.log(res);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) return <MainLoader />;
  if (isError) return <p>Something went wrog while fetching data.</p>;
  return (
    <>
      <div>
        <h2 className="text-primary md:text-xl font-semibold md:font-normal  mb-4 text-center">
          All Category
        </h2>
        <table className="min-w-full bg-primary text-secondary rounded-lg overflow-x-hidden">
          <thead className="bg-secondary text-primary font-bold">
            <tr>
              <th className=" px-4.5 py-4 text-left text-xs italic  uppercase tracking-wider">
                S.No
              </th>
              <th className="  px-4.5 py-4 text-left text-xs italic  uppercase tracking-wider">
                Name
              </th>
              <th className=" px-4.5 py-4 text-center text-xs italic uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-b-color ">
            {categories?.map(({ category, _id }, i) => {
              return (
                <tr key={_id} className="transition-colors">
                  <td className={` px-4.5 py-3 `}>{i + 1}</td>
                  <td className=" px-4.5 py-3  ">{category}</td>
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
                      className={`flex flex-col gap-1 w-24 bg-secondary border border-primary text-primary p-1.5 rounded text-sm absolute right-1/2 transition-all origin-top-right duration-300 ease-in-out shadow z-50 ${
                        actionId == _id ? "scale-100" : "scale-0"
                      }`}
                    >
                      <Link href={`edit-category/${_id}`}>
                        <button className="w-full cursor-pointer hover:bg-primary px-2 py-2  font-medium  transition-colors">
                          Edit
                        </button>
                      </Link>
                      <button
                        className="w-full cursor-pointer hover:bg-primary px-2 py-2 font-medium   transition-colors"
                        onClick={() => handleDelete(_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {categories?.length == 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                  No category
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllCategory;
