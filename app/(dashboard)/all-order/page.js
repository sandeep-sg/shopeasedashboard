"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const AllOrder = () => {
  const getOrders = async () => {
    const res = await axios.get("/api/order");
    return res.data.data;
  };

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) {
    return <div className="p-3">Loading orders...</div>;
  }

  if (isError) {
    return <div className="p-3 text-red-500">Failed to load orders.</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">All Orders</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and view all customer orders.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg  shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full bg-primary text-secondary rounded-lg shadow overflow-x-auto">
            <thead className="border-b border-b-color text-primary font-bold">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">
                  Customer
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Items
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Total
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Payment
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="transition ">
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium ">
                          {order.user?.username || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs ">
                          {order.user?.email || "-"}
                        </p>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        {order.items?.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-2"
                          >
                            <div>
                              <p className="font-medium ">
                                {item.product?.name || "Product"}
                              </p>

                              <p className="text-xs">
                                Size: {item.size} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <span className="font-semibold">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium uppercase ">
                          {order.paymentMethod}
                        </p>

                        <p className="mt-1 text-xs capitalize ">
                          {order.paymentStatus}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-700"
                                : order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrder;
