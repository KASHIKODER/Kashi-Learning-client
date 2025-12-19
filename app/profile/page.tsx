"use client";
import * as React from "react";
import { FC, useState, Suspense } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dynamic from 'next/dynamic';

// ⚡ DYNAMIC IMPORTS for heavy components
const Profile = dynamic(() => import("../components/Profile/Profile"), {
  loading: () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false, // Don't render on server for faster initial load
});

type Props = object;

const Page: FC<Props> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeItem] = useState<number>(5);
  const [route, setRoute] = useState<string>("Login");
  const { user } = useSelector((state: RootState) => state.auth); 

  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name} profile - ELearning`}
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <Profile user={user} />
        </Suspense>
      </Protected>
    </div>
  );
};

export default Page;