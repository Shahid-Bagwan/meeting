"use client";
import dynamic from "next/dynamic";

const Meeting = dynamic(() => import("./Meeting"), { ssr: false });
const Page = () => {
  return (
    <>
      <Meeting />
    </>
  );
};

export default Page;
