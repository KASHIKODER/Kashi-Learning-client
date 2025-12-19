"use client";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useTheme } from "next-themes";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type Props = object;

const Hero: FC<Props> = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data, refetch} = useGetHeroDataQuery("Banner", {});

  // ✅ Wait until client is mounted
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg" />;

  const isDark = theme === "dark";

  const image = data?.layout?.banner?.image?.url || "/assets/banner-img-1.png";
  const title =
    data?.layout?.banner?.title ||
    "Improve Your Online Learning Experience Better Instantly";
  const subTitle =
    data?.layout?.banner?.subTitle ||
    "We have 40k+ Online courses & 500k+ Online registered students. Find your desired Courses from them.";

  return (
    <div
      className={`w-full flex flex-col lg:flex-row items-center justify-between py-[80px] px-5 relative transition-all duration-500 ${
        isDark ? "bg-[#0a0a0a]" : "bg-[#ffffff]"
      }`}
    >
      {/* LEFT SIDE IMAGE */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center">
        <div className="relative h-[260px] w-[260px] sm:h-[340px] sm:w-[340px] lg:h-[400px] lg:w-[400px] xl:h-[460px] xl:w-[460px] rounded-full overflow-hidden hero_banner_animation flex items-center justify-center shadow-2xl transition-all duration-500">
          <Image
            src={image}
            alt="Learning illustration"
            fill
            className="object-cover rounded-full"
            priority
          />
        </div>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-[60px] lg:mt-0 z-20 px-4">
        <h2
          className={`${
            isDark ? "text-white" : "text-[#111111]"
          } text-[28px] sm:text-[36px] lg:text-[50px] xl:text-[60px] font-[700] font-Josefin leading-tight transition-all duration-500`}
        >
          {title}
        </h2>

        <p
          className={`${
            isDark ? "text-[#edfff4]" : "text-[#444444]"
          } font-Josefin font-[600] text-[16px] sm:text-[18px] mt-5 max-w-[550px] transition-all duration-500`}
        >
          {subTitle}
        </p>

        {/* SEARCH BAR */}
        <div className="mt-8 w-full max-w-[550px] relative">
          <input
            type="search"
            placeholder="Search Courses..."
            className={`${
              isDark
                ? "bg-[#575757] text-white placeholder:text-[#ffffffb3] border-none"
                : "bg-[#f2f2f2] text-[#111111] placeholder:text-[#555555] border border-[#ddd]"
            } rounded-[5px] p-2 w-full h-[50px] outline-none text-[18px] font-[500] font-Josefin transition-all duration-500`}
          />
          <div
            className={`absolute flex items-center justify-center w-[50px] h-[50px] right-0 top-0 ${
              isDark ? "bg-[#46e256]" : "bg-[#39c1f3]"
            } rounded-r-[5px] cursor-pointer transition-all duration-500`}
          >
            <BiSearch className="text-white" size={25} />
          </div>
        </div>

        {/* PEOPLE IMAGES */}
        <div className="flex items-center mt-10 space-x-[-15px] overflow-x-auto">
          {["2", "3", "4"].map((num) => (
            <div key={num} className="relative w-[45px] h-[45px] flex-shrink-0">
              <Image
                src={`/assets/banner-img-${num}.png`}
                alt={`user${num}`}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ))}
          <p
            className={`font-Josefin pl-5 text-[16px] sm:text-[18px] font-[600] transition-all duration-500 ${
              isDark ? "text-[#edfff4]" : "text-[#333333]"
            }`}
          >
            500K+ People already trusted us.{" "}
            <Link
              href={`/course/${data?._id}`}
              className={`${
                isDark ? "text-[#46e256]" : "text-[#00b14f]"
              } transition-all duration-500`}
            >
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
