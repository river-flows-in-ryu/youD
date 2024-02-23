"use client";
import { useState } from "react";

import Link from "next/link";

export default function Page() {
  const [userID, setUserID] = useState("");
  const [userPW, setUserPW] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(userID, userPW);
  }

  return (
    <div className="max-w-screen-xl m-auto h-full">
      <div className="bg-[#dedede]  flex justify-center relative">
        <div
          className="bg-white w-[85%] h-[70%] absolute top-[50%] left-[50%]
          transform translate-x-[-50%] translate-y-[-50%] rounded-lg text-center "
        >
          <form onSubmit={handleSubmit} className="px-[30px] py-[50px]">
            <div className="mb-[30px] text-[35px]">
              <span>로그인</span>
            </div>
            <div className="mb-[15px]">
              <input
                type="text"
                value={userID}
                onChange={(event) => setUserID(event.target.value)}
                placeholder="사용자 이름"
                className="w-[100%] h-[30px] bg-[#dedede]"
              />
            </div>
            <div className="mb-[10px]">
              <input
                type="password"
                value={userPW}
                onChange={(event) => setUserPW(event.target.value)}
                placeholder="비밀번호"
                className="w-[100%] h-[30px] bg-[#dedede]"
              />
            </div>
            <div className="mb-[25px]">
              <span className="text-red-500">
                아이디 혹은 비밀번호를 확인해주세요
              </span>
            </div>
            <div className="flex justify-end mb-[35px] gap-2">
              <Link href="">
                <span>아이디 찾기</span>
              </Link>
              <Link href="">
                <span>비밀번호 찾기</span>
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className="h-10 w-[135px] bg-primary text-white mb-[10px]"
              >
                로그인
              </button>
            </div>
            <div>
              <button className="h-10 w-[135px] border-primary border ">
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
