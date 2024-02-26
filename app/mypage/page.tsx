import React from "react";

export default function Page() {
  return (
    <div className="text-center items-center py-10">
      <div className="flex justify-center">
        <div className="w-[200px] h-[200px] rounded-[50%] bg-[#dedede]"></div>
      </div>
      <div className="mt-[30px] mb-[60px]">
        <span className="font-bold">유가람님</span>
      </div>
      <div className="flex justify-center">
        <div className="w-[280px] h-[280px] bg-[#dedede] rounded-2xl ">
          <div className="px-6 w-full h-full">
            <div className="w-full h-[70px] leading-[70px] border-b border-black"></div>
            <div className="w-full h-[70px] leading-[70px] border-b border-black"></div>
            <div className="w-full h-[70px] leading-[70px] border-b border-black"></div>
            <div className="w-full h-[70px] leading-[70px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
