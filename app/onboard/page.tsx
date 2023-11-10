"use client";

import BuildingInput from "@/components/onboard/buildingInput";
import OnBoardSidebar from "@/components/onboard/sidebar";
import { useEffect } from "react";

const OnBoard = () => {
  return (
    <div className="pt-10 w-full h-full bg-gradient-to-r from-gray-100 to-gray-100 bg-white flex flex-row justify-center gap-10">
      <BuildingInput />
      <OnBoardSidebar />
    </div>
  );
};

export default OnBoard;
