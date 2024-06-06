"use client";

import React, { useState, useEffect } from "react";

import { serverFetch } from "@/components/serverFetch";
import { useRouter } from "next/navigation";

import { guestUserId } from "../store";
import Container from "@/components/container";
export default function Page() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [isMatch, setIsMatch] = useState(false);

  const { userId, setUserId } = guestUserId();

  useEffect(() => {
    if (userId === 0) {
      // router.push("/login");
    }
    if (password === checkPassword) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  }, [password, checkPassword]);

  const payload = {
    user_id: userId,
    password: password,
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const handleChangeCheckPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setCheckPassword(event.target.value);
  };

  async function handleSubmit() {
    if (password === "" || checkPassword === "") return;
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/change_password/${userId}`,
      "PATCH",
      payload
    );
    if (res.message === "SUCCESS") {
      setUserId(0);
      router.push("/login");
    }
  }
  return (
    <Container>
      <div className="w-full min-h-full flex flex-col justify-center items-center">
        <div className="w-full flex justify-center text-center flex-col ">
          <label className="font-bold  text-2xl">비밀번호 찾기</label>
          <label className="mt-10">변경 비밀번호</label>
          <input
            className="w-[70%] border m-auto rounded border-[#cecece] px-[10px]
        h-10 mt-2 text-center"
            placeholder="비밀번호를 입력해주세요"
            type="password"
            value={password}
            onChange={handleChangePassword}
          />
          <label className="mt-5">비밀번호 확인</label>
          <input
            className="w-[70%] border m-auto rounded border-[#cecece] px-[10px]
        h-10 mt-2 text-center"
            placeholder="Email를 입력해주세요"
            type="password"
            value={checkPassword}
            onChange={handleChangeCheckPassword}
          />
          {password !== "" && checkPassword !== "" && (
            <label className="text-red-500">
              {isMatch ? "일치합니다" : "불일치합니다"}
            </label>
          )}
          {isMatch && password !== "" && checkPassword !== "" ? (
            <button
              className="w-[70%] m-auto border border-primary bg-primary text-white rounded h-10 mt-10"
              onClick={handleSubmit}
            >
              제출하기
            </button>
          ) : (
            <button
              className="w-[70%] m-auto border border-[#cecece] bg-[#cecece] text-black rounded h-10 mt-10"
              disabled
            >
              제출하기
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}
