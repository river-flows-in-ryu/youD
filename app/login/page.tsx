"use client";
import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useUserIdStore } from "../store";

export default function Page() {
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [userPW, setUserPW] = useState("");

  const [err, setErr] = useState(true);

  const { userId, setUserId } = useUserIdStore();

  const payload = {
    username: userID,
    password: userPW,
  };

  async function userDataFetch() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const userData = await res.json();
    console.log(userData);
    if (userData) {
      setUserId(userData?.user?.id);
    }
    return userData;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userData = await userDataFetch();
    if (userData) {
      router.push("/");
    }
  }

  return (
    <div className="min-h-full flex flex-1">
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="bg-white  w-[285px] h-[495px] sm:w-[600px] sm:h-[600px]  rounded-lg text-center  ">
          <form onSubmit={handleSubmit} className="px-[24px] py-[45px]">
            <div className="mb-[30px] text-[35px]">
              <span>로그인</span>
            </div>
            <div className="mb-[15px]">
              <input
                type="text"
                value={userID}
                onChange={(event) => setUserID(event.target.value)}
                placeholder="사용자 이름"
                className="w-[100%] h-[45px] sm:w-[460px] sm:h-[50px] bg-[#dedede] sm:bg-[#dedede] pl-[20px] 
            "
              />
            </div>
            <div className="mb-[10px]">
              <input
                type="password"
                value={userPW}
                onChange={(event) => setUserPW(event.target.value)}
                placeholder="비밀번호"
                className="w-[100%] h-[45px] sm:w-[460px] sm:h-[50px] bg-[#dedede] pl-[20px] sm:bg-[#dedede]"
              />
            </div>
            <div className={`${!err ? "block" : "hidden"} mb-[25px]`}>
              <span className="text-red-500 text-[14px]">
                아이디 혹은 비밀번호를 확인해주세요
              </span>
            </div>
            <div className="flex justify-end mb-[35px] gap-2 sm:pr-[50px]">
              <Link href="">
                <span>아이디 찾기</span>
              </Link>
              <Link href="/find-password">
                <span>비밀번호 찾기</span>
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className="h-10 w-full sm:w-[450px] bg-primary text-white mb-[10px] rounded-lg "
              >
                로그인
              </button>
            </div>
            <Link href="/signup">
              <div>
                <button className="h-10 w-full sm:w-[450px] border-primary border rounded-lg ">
                  회원가입
                </button>
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
