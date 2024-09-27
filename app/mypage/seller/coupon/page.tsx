"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Container from "@/components/container";

import { useUserIdStore } from "@/app/store";
import { commonFetch } from "@/utils/commonFetch";

import { changeDateType } from "@/utils/changeDateType";

import { Coupon } from "@/types/coupon";
import Link from "next/link";
import Pagination from "@/utils/pagination";

export default function Page() {
  const { userId } = useUserIdStore();

  const router = useRouter();

  const [sellerCouponData, setSellerCouponData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [checkedItems, setCheckedItems] = useState<Number[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (userId) {
      try {
        const fetchData = async () => {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/coupons/seller/${userId}?offset=${(page - 1) * 10}&limit=10`,
            "get"
          );
          if (res?.result === "SUCCESS") {
            setSellerCouponData(res?.data);
            setTotalCount(res?.total_count);
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
  }, [userId, page]);

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prev) => {
      if (checkedItems?.includes(index)) {
        return checkedItems.filter((item) => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleAllCheckChange = () => {
    if (checkedItems?.length === 10) {
      setCheckedItems([]);
    } else {
      setCheckedItems(sellerCouponData?.map((coupon: Coupon) => coupon?.id));
    }
  };

  async function handleClickDelete() {
    if (checkedItems?.length === 0) {
      alert("선택된 사항이 없습니다.");
      return;
    }
    if (
      confirm(`${checkedItems?.length}건의 쿠폰을 정말로 삭제하시겠습니까?`)
    ) {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/seller/delete`,
        "delete",
        {
          data: checkedItems,
        }
      );
      console.log(res);
      if (res?.message === "SUCCESS") {
        alert(res?.data);
        router?.refresh();
      }
    } else {
      return;
    }
  }

  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto">
        <h2 className=" font-bold text-xl py-5 px-5">SELLER 쿠폰목록</h2>
        <div className="flex justify-end mb-5 gap-[10px] pr-2.5">
          <button
            className="px-4 py-1 border border-primary rounded bg-primary text-white"
            onClick={() => {
              router.push("/mypage/coupon/add");
            }}
          >
            추가
          </button>
          <button
            className="px-4 py-1 border border-red-500 rounded bg-red-500 text-white"
            onClick={handleClickDelete}
          >
            삭제
          </button>
        </div>

        <div className="w-full overflow-x-auto mb-[30px]">
          <table className="sm:w-full  text-center table-auto min-w-[650px]">
            <thead className="h-[55px]">
              <tr className="bg-[#f9f9f9]">
                <th>
                  <input
                    type="checkbox"
                    className={`w-5 h-5 checked:bg-primary border  border-[#ccc] checked:border-primary bg-[#fff] rounded-full mr-2.5 appearance-none checked:bg-checkedWhite cursor-pointer`}
                    onChange={handleAllCheckChange}
                    checked={checkedItems.length === 10}
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
                      checked={checkedItems?.includes(coupon?.id)}
                      onChange={() => handleCheckboxChange(coupon?.id)}
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
        <Pagination
          page={page}
          totalCount={totalCount}
          pageSize={10}
          onChange={setPage}
        />
      </div>
    </Container>
  );
}
