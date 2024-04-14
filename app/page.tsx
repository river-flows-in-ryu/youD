"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";

import fdwqe from "../public/fdwqe.jpeg";

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_list`);
    const jsonRes = await res.json();
    setData(jsonRes);
  }

  console.log(data);
  const htmlString = data[0]?.info;

  if (data && data[0]?.image_url)
    return (
      <CookiesProvider>
        <main className="flex flex-1 f-full flex-col w-screen">
          <div className="w-full h-[300px]">
            <Image src={fdwqe} alt="image" className="w-full h-full" />
          </div>
          <Link href="/goods/1">
            <button className="w-10 h-10">이동하자</button>
          </Link>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-[10px]">
            <div className="flex-shrink-0 w-[150px] h-[150px] bg-red-300">
              z
            </div>
            <div className="flex-shrink-0 w-[150px] h-[150px] bg-red-300">
              z
            </div>
            <div className="flex-shrink-0 w-[150px] h-[150px] bg-red-300">
              z
            </div>
            <div className=" flex-shrink-0 w-[150px] h-[150px] bg-red-300">
              z
            </div>
          </div>
          {/* <div dangerouslySetInnerHTML={{ __html: htmlString }} /> */}
        </main>
      </CookiesProvider>
    );
}
