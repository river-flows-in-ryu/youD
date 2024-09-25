"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Container from "@/components/container";

import { useUserIdStore } from "@/app/store";
import { commonFetch } from "@/utils/commonFetch";

import { changeDateType } from "@/utils/changeDateType";

import { Coupon } from "@/types/coupon";
import Link from "next/link";

export default function Page() {
  const { userId } = useUserIdStore();

  const router = useRouter();

  const [sellerCouponData, setSellerCouponData] = useState([]);

  useEffect(() => {
    if (userId) {
      try {
        const fetchData = async () => {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/coupons/seller/${userId}`,
            "get"
          );
          if (res?.result === "SUCCESS") {
            console.log(res?.data);
            setSellerCouponData(res?.data);
          } else {
            alert("네트워크 오류입니다.");
          }
        };
        fetchData();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  }, [userId]);

  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto">
        <h2 className=" font-bold text-xl py-5 px-5">SELLER 쿠폰목록</h2>
        <div className="flex justify-end mb-5 gap-[10px]">
          <button
            className="px-4 py-1 border border-primary rounded bg-primary text-white"
            onClick={() => {
              router.push("/mypage/coupon/add");
            }}
          >
            추가
          </button>
          <button className="px-4 py-1 border border-red-500 rounded bg-red-500 text-white">
            삭제
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="sm:w-full  text-center table-auto min-w-[650px]">
            <thead className="h-[55px]">
              <tr className="bg-[#f9f9f9]">
                <th>
                  <input
                    type="checkbox"
                    className={`w-5 h-5 checked:bg-primary border  border-[#ccc] checked:border-primary bg-[#fff] rounded-full mr-2.5 appearance-none checked:bg-checkedWhite cursor-pointer`}
                    // checked={checkedItems.length === totalCount}
                    style={{
                      backgroundImage: "url('/check_white.png')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "contain",
                    }}
                  />
                </th>
                <th>쿠폰명</th>
                <th>할인값</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>활성화</th>
              </tr>
            </thead>
            <tbody>
              {sellerCouponData?.map((coupon: Coupon) => (
                <tr key={coupon?.id}>
                  <td className="h-[55px]">
                    <input
                      type="checkbox"
                      className={`w-5 h-5 checked:bg-primary border  border-[#ccc] checked:border-primary bg-[#fff] rounded-full mr-2.5 appearance-none checked:bg-checkedWhite cursor-pointer`}
                      // checked={checkedItems.length === totalCount}
                      style={{
                        backgroundImage: "url('/check_white.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                      }}
                    />
                  </td>
                  <td>
                    <Link href={`/mypage/coupon/modify?couponId=${coupon?.id}`}>
                      <span className="text-blue-500  truncate">
                        {coupon?.name}
                      </span>
                    </Link>
                  </td>
                  <td>
                    <span>
                      {Number(coupon?.discount_value)?.toLocaleString()}&nbsp;
                      {coupon?.discount_type === "percent" ? "%" : "원"}
                    </span>
                  </td>
                  <td>
                    <span>{changeDateType(coupon?.valid_from)}</span>
                  </td>
                  <td>
                    <span>{changeDateType(coupon?.valid_to)}</span>
                  </td>
                  <td>
                    <span>{coupon?.active ? "Y" : "N"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
