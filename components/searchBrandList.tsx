import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { commonFetch } from "@/utils/commonFetch";
import Pagination from "@/utils/pagination";

interface UserInfo {
  university_name: string;
  id: number;
  name: string;
  image: string;
  userName: string;
  user: number;
}
export default function SearchBrandList() {
  const urlParams = useSearchParams();
  const keyword = urlParams?.get("keyword")?.trim() || "";

  const [page, setPage] = useState(1);
  const [brandData, setBrandData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search/brands?keyword=${encodeURIComponent(keyword?.trim())}&offset=${(page - 1) * 10}&limit=30`,
        "get"
      );
      setBrandData(res?.brands);
      setTotalCount(res?.brandsCount);
    };
    fetchData();
  }, [keyword]);

  return (
    <div>
      <div className="mb-10">
        {brandData?.map((user: UserInfo) => (
          <div key={user?.id} className="mb-5">
            <Link href={`/brands/${user?.user}`}>
              <div className="flex px-3 w-full ">
                {/* 이미지 */}
                <div
                  className={`w-[45px] h-[45px] rounded-[50%]
                    ${user?.image ? "bg-white" : "bg-black"}
                 mr-5 flex-shrink-0 relative`}
                >
                  <Image
                    src={user?.image}
                    alt="유저 이미지"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <span className="font-bold">
                    {user?.name}
                    <span className="ml-0.5">({user?.userName})</span>
                  </span>
                  <span className="text-sm">{user?.university_name}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <Pagination
        page={page}
        onChange={setPage}
        totalCount={totalCount}
        pageSize={30}
      />
    </div>
  );
}
