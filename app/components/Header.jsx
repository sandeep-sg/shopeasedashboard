"use client";
import React, { useEffect, useState } from "react";
import DarkModeIcon from "./icons/DarkModeIcon";
import LightModeIcon from "./icons/LightModeIcon";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "../store/themeSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const Header = () => {
  const isThemeDark = useSelector((state) => state.theme.isThemeDark);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    dispatch(setTheme(theme == "dark"));
  }, []);
  const logout = async () => {
    try {
      const res = await axios.post("/api/logout");
      if (res.status === 200) {
        router.push("/login"); // redirect to login after logout
        toast.success("Logout successfully");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const getAdmin = () => {
    const [admin, setAdmin] = useState("");

    useEffect(() => {
      const adminName = localStorage.getItem("admin") || "";
      setAdmin(adminName);
    }, []);

    return admin;
  };
  return (
    <div className="w-full flex gap-3 justify-between items-center px-4 md:px-10 h-16 bg-header shadow">
      <div></div>
      <h2 className="font-semibold">Welcome {getAdmin()}</h2>
      <div className="flex items-center gap-3">
        <button
          className="cursor-pointer"
          onClick={() => dispatch(toggleTheme())}
        >
          {isThemeDark ? (
            <LightModeIcon isThemeDark={isThemeDark} />
          ) : (
            <DarkModeIcon />
          )}
        </button>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-2.5 md:px-4 py-1 md:py-1.5 rounded text-white cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
