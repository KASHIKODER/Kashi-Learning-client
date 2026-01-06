import Link from "next/link";
import React from "react";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/course/68f78c94004e3d391150e620" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
  poppinsVariable?: string;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      {/* ✅ Desktop Menu */}
      <div className="hidden md:flex">
        {navItemsData.map((item, index) => (
          <Link 
            href={item.url} 
            key={index}
            prefetch={false}  // ← ADD THIS
            scroll={false}    // ← ADD THIS
          >
            <span
              className={`${
                activeItem === index
                  ? "dark:text-[#37a39a] text-[crimson]"
                  : "dark:text-white text-black"
              } text-[18px] px-6 font-Poppins font-[400] cursor-pointer`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* ✅ Mobile Menu */}
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href={"/"} passHref prefetch={false}>
              <span className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                ELearning
              </span>
            </Link>
          </div>
          {navItemsData.map((item, index) => (
            <Link 
              href={item.url} 
              key={index}
              prefetch={false}  // ← ADD THIS
              scroll={false}    // ← ADD THIS
            >
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                } block py-5 text-[18px] px-6 font-Poppins font-[400] cursor-pointer`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;