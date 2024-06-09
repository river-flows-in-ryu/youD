import React, { useState, useRef, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "antd";
import { useCookies } from "react-cookie";

import {
  useCartCountStore,
  useMainHamburgerToggleStore,
  useUserIdStore,
} from "@/app/store";

import HamburgerDropdown from "./hamburgerDropdown";

import hamburger from "../public/hamburger.png";

export default function PcLayout() {
  const { toggle, setToggle } = useMainHamburgerToggleStore();
  const { fetchCartItemCount, itemCount } = useCartCountStore();

  const [searchText, setSearchText] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { userId, setUserId } = useUserIdStore();

  const router = useRouter();

  const [, , removeCookie] = useCookies(["access_token"]);

  const primaryColor = "#77C497";

  useEffect(() => {
    setSearchText("");
  }, [router]);

  function handleChangeSearchText(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }

  function handleSearch() {
    if (searchText.trimEnd() === "") return alert("검색어를 입력해주세요");
    router.push(`/search?keyword=${encodeURIComponent(searchText)}`);
  }

  async function handleLogout() {
    setUserId(0);
    useUserIdStore?.persist?.clearStorage();
    removeCookie("access_token");
    await logout();
  }

  async function logout() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.status === 200) {
      sessionStorage.removeItem("selectedProducts");
      router.refresh();
    }
  }
  return (
    <div className="">
      <div className="fixed w-full py-5 h-[130px] border-[#dedede] border-b bg-white z-10">
        <div className="flex flex-col  m-auto">
          <div className="flex justify-between px-5 sm:w-full xl:w-[1280px] m-auto ">
            <button onClick={setToggle} className="relative">
              <Image src={hamburger} alt="hamburgerImage" />
            </button>
            <div className="">
              <input
                className="mr-[15px] rounded-md px-3 py-[9px] placeholder:text-base h-10 border "
                placeholder="검색어를 입력해주세요"
                onChange={handleChangeSearchText}
                value={searchText}
                onKeyDown={handleKeyDown}
              ></input>
              <button
                className="rounded-md border px-4 py-2"
                onClick={handleSearch}
              >
                검색하기
              </button>
            </div>
          </div>
          <div
            className={`
${toggle ? "block" : "hidden"}
w-[150px] h-[450px] bg-primary absolute top-20
`}
            ref={dropdownRef}
          >
            <HamburgerDropdown />
          </div>
          <div className="block mt-2">
            <div className="w-full flex justify-center">
              <div className="w-[1280px] flex justify-end pr-5 gap-9">
                {!userId ? (
                  <>
                    <Link href="/signup">
                      <span className="text-primary">회원가입</span>
                    </Link>
                    <Link href="/login">
                      <span>로그인</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/mypage">
                      <span>마이페이지</span>
                    </Link>
                    <button onClick={handleLogout}>
                      <span>로그아웃</span>
                    </button>
                  </>
                )}
                <Link href="/cart">
                  <span className="mr-[3px]">장바구니</span>
                  {userId ? (
                    <Badge
                      count={itemCount}
                      color={primaryColor}
                      styles={{ root: { margin: "0 0 3px 0" } }}
                    ></Badge>
                  ) : null}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
