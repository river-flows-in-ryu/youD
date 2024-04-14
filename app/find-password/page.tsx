"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { serverFetch } from "@/components/serverFetch";
import { guestUserId } from "../store";

export default function Page() {
  const [id, setId] = useState("");
  const [eamil, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { setUserId } = guestUserId();

  const router = useRouter();

  const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setId(event.target.value);
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(eamil)) {
      setErrorMessage("Email을 확인해주세요");
      event.target.focus();
    }
  };

  const payload = {
    username: id,
    email: eamil,
  };

  async function handleSubmit() {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/find_password`,
      "post",
      payload
    );
    console.log(res);
    if (res.message === "SUCCESS") {
      setErrorMessage("");
      setUserId(res.userId);
      router.push("/change-password");
    }
    if (res.message !== "SUCCESS") {
      setErrorMessage(res.message);
    }
  }

  return (
    //
    <div className="w-full min-h-full flex flex-col justify-center items-center">
      <div className="w-full  flex justify-center text-center flex-col ">
        <label className="font-bold text-2xl	">비밀번호 찾기</label>
        <label className="mt-10 ">ID</label>
        <input
          className="w-[70%] border m-auto rounded border-[#cecece] px-[10px]
          h-10 mt-2"
          placeholder="ID를 입력해주세요"
          type="text"
          value={id}
          onChange={handleChangeId}
        />
        <label className="mt-5">Email</label>
        <input
          className="w-[70%] border m-auto rounded border-[#cecece] px-[10px]
          h-10 mt-2"
          placeholder="Email를 입력해주세요"
          type="text"
          value={eamil}
          onChange={handleChangeEmail}
          onBlur={handleBlur}
        />
        <label className="text-red-500">{errorMessage}</label>
        <button
          className="w-[70%] m-auto border border-primary bg-primary text-white rounded h-10 mt-10"
          onClick={handleSubmit}
        >
          제출하기
        </button>
      </div>
    </div>
  );
}
