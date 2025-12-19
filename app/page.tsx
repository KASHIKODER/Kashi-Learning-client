'use client'
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer"

type Props = object

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem,] = useState(0);
   const [route,setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="ELearning"
        description="ELearning is a platform for student to learn and get hepl from teachers"
        keywords="Programming, MERN , Redux , Machine Learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <div className="pt-[50px] overflow-y-auto min-h-screen">
        <Hero />
        <Courses />
        <Reviews />
        <FAQ />
        <Footer />
      </div>
    </div>
  )
};

export default Page;