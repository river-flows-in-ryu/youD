"use client";

import React from "react";

import { Tabs } from "antd";

import type { TabsProps } from "antd";

import { changeEndTime } from "@/utils/changeDateType";

interface CouponItem {
  id: number;
  discount_type: string;
  discount_value: string;
  name: string;
  min_purchase: string;
  valid_to: string;
  brand: null | number;
}

const CouponItem = ({ data }: { data: CouponItem[] }) => {
  return (
    <>
      {data?.map((coupon: CouponItem) => (
        <div className="w-full flex h-[125px] mb-5" key={coupon?.id}>
          <div className="w-[20%]  flex items-center justify-center bg-primary rounded border-r border-dashed border-white ">
            <span className="transform rotate-[270deg] text-white text-xl">
              coupon
            </span>
          </div>
          <div className="w-[80%] border border-primary rounded flex flex-col pl-[30px] py-[15px]">
            <span className="text-xl font-bold text-[#e0515f] ">
              {coupon?.discount_type !== "fixed"
                ? `${Number(coupon?.discount_value)}% `
                : `${Number(coupon?.discount_value)?.toLocaleString()}원 `}
              할인
            </span>
            <span className="font-bold mt-[5px] text-base	mb-[5px]">
              {coupon?.name}
            </span>
            {coupon?.min_purchase && (
              <span className="text-xs ">
                최소주문금액 : {Number(coupon?.min_purchase)?.toLocaleString()}
                원
              </span>
            )}
            <span className="text-xs">
              {changeEndTime(coupon?.valid_to)} 까지
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

const AllCouponData = ({
  userCouponData,
}: {
  userCouponData: CouponItem[];
}) => {
  return <CouponItem data={userCouponData} />;
};

const BrandCouponData = ({ brandCoupon }: { brandCoupon: CouponItem[] }) => {
  return <CouponItem data={brandCoupon} />;
};
export default function Client({
  userCouponData,
}: {
  userCouponData: CouponItem[];
}) {
  const brandCoupon = userCouponData.filter((coupon) => coupon?.brand);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "전체",
      children: <AllCouponData userCouponData={userCouponData} />,
    },
    {
      key: "2",
      label: "브랜드",
      children: <BrandCouponData brandCoupon={brandCoupon} />,
    },
  ];

  return (
    <section className="sm:w-[650px] sm:mx-auto w-full">
      <h2 className=" font-bold text-xl py-5 px-5">보유 쿠폰 목록</h2>
      <div className="px-5">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </section>
  );
}
