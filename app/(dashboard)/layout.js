"use client";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function RootLayout({ children }) {
  const isThemeDark = useSelector((state) => state.theme.isThemeDark);
  useEffect(() => {
    if (isThemeDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isThemeDark]);
    useEffect(() => {
    document.title = "ShopEase Dashboard";
  }, []);
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Header />
        <div className="py-2 md:py-6 px-4 md:px-10">{children}</div>
      </div>
    </div>
  );
}
