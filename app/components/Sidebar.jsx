"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import MenuIcon from "./icons/MenuIcon";
import { navLinks } from "../constant/navlinks";
import Image from "next/image";
const Sidebar = () => {
  const pathname = usePathname();
  function getNavNameByPath(pathname) {
    const match = navLinks.find((nav) =>
      nav.subNav?.some((sub) => sub.link === pathname)
    );
    return match ? match.name : null;
  }
  const [activeTab, setActiveTab] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  useEffect(() => {
    setActiveTab(getNavNameByPath(pathname));
  }, []);

  const handleMenuOpen = () => {
    setIsMenuOpen((prev) => !prev);
  };
  // console.log(pathname, "path");
  return (
    <>
      <div
        className={`${
          isMenuOpen ? "w-[200px] md:w-[300px]" : "w-[61px]"
        }  min-h-screen bg-primary transition-all duration-500`}
      >
        {/* logo */}
        <div className="flex items-center gap-2 text-2xl font-bold  px-6 py-3">
          <div className="cursor-pointer " onClick={handleMenuOpen}>
            <MenuIcon className="icon-color" />
          </div>
          {/* <div
            className={`text-orange ${
              isMenuOpen ? "scale-100" : "scale-0"
            } transition-all duration-300 origin-left`}
          >
            ShopEase
          </div> */}
          <Image
            className={` w-40 h-10 ${
              isMenuOpen ? "scale-100" : "scale-0"
            } transition-all duration-300 origin-left`}
            width={140}
            height={30}
            alt="logo"
            src="/logo.png"
          />
        </div>
        {/* nav  */}
        <ul className="flex flex-col ">
          {navLinks.map(({ name, icon, subNav }, i) => {
            return (
              <li
                key={i}
                className={`text-primary overflow-hidden cursor-pointer`}
              >
                <span
                  onClick={() => {
                    setActiveTab((prev) => (prev == name ? "" : name));
                    setIsMenuOpen(true);
                  }}
                  className={`block  p-4 overflow-hidden hover:bg-secondary transition-all 0.7s ease-in-out
                  ${
                    activeTab == name
                      ? "bg-secondary border-l-5 border-orange"
                      : "border-l-5 border-transparent"
                  }
                `}
                >
                  {name == "Dashboard" ? (
                    <Link href="/" className="flex items-center gap-4">
                      <span>{icon}</span> <span>{name}</span>
                    </Link>
                  ) : (
                    <div className="flex gap-4 items-center">
                      <span>{icon}</span>
                      <span>{name}</span>
                    </div>
                  )}
                </span>
                {/* sub links */}
                <ul
                  className={`text-sm text-secondary border-b  ${
                    isMenuOpen && activeTab == name
                      ? `${name == "Dashboard" ? " max-h-0" : " max-h-96"} `
                      : "max-h-0 "
                  } transition-all duration-700 overflow-hidden`}
                >
                  {subNav?.map(({ subname, link }, i) => {
                    return (
                      <li key={i} className="py-2.5 pl-16 whitespace-nowrap">
                        <Link href={link} className={`${link == pathname ? "text-primary":""} hover:text-primary `}>
                          {subname}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
