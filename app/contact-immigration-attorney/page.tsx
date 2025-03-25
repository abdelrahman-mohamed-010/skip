import Navigation from "@/components/Navigation";
import PageCTA from "@/components/PageCTA";
import React from "react";

const page = () => {
  return (
    <>
      <Navigation />
      <div className=" pt-24 text-primary text-3xl font-bold w-full text-center"></div>
      <PageCTA />
    </>
  );
};

export default page;
