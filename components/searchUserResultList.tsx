import React from "react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import arrowBlack from "../public/arrow_forward_balck.png";

interface UserInfo {
  university_name: string;
  id: number;
  name: string;
  image: string;
  userName: string;
}
interface Props {
  searchUserResultsCount: number;
  keyword: string | null;
  searchUserResults: UserInfo[];
}

export default function SearchUserResultList({
  searchUserResultsCount,
  keyword,
  searchUserResults,
}: Props) {
  const router = useRouter();

  function handleClickAllUserList() {
    router?.push(`/search?type=brands&keyword=${keyword}`);
  }

  return (
    <div className="">
      <div className="w-full flex justify-between my-[30px] px-3">
        <div className=" flex">
          <h2 className="font-bold mr-1">유저</h2>
          <span className="">{searchUserResultsCount}</span>
        </div>
        {searchUserResultsCount === 0 ? null : (
          <Link href={`/search?type=brands&keyword=${keyword}`}>
            <Image src={arrowBlack} alt="전체보기" width={20} height={20} />
          </Link>
        )}
      </div>
      {searchUserResultsCount === 0 ? (
        <div className="flex text-center justify-center ">
          <div className="flex flex-col text-[#919191] h-[150px]">
            <span>해당 브랜드가 없습니다.</span>
            <span>검색어를 정확히 입력해주세요</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-10">
            {searchUserResults?.map((user: UserInfo) => (
              <div key={user?.id} className="mb-5">
                <Link href={`/brands/${user?.id}`}>
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
          <div className="w-full flex justify-center mb-10">
            <button
              className="w-full mx-5 border border-[#f2f2f2] bg-[#f2f2f2] h-[50px] rounded "
              onClick={handleClickAllUserList}
            >
              유저 전체보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
