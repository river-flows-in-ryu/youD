"use client";

import React, { useEffect, useState } from "react";

import { Steps } from "antd";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import trackingInfoFetch from "./dataFetch";

import { deliveryCompanyList } from "@/utils/deliveryCompanyList";

import { Product } from "@/types/product";

interface DeliveryResponse {
  node: {
    description: string;
    status: {
      name: string;
      code: string;
    };
    time: string;
  };
}

interface Props {
  orderDetailData: {
    shipping_company: string;
    tracking_number: string;
    price: number;
    product: Product;
    product_name: string;
    quantity: number;
    size: {
      name: string;
      id: number;
    };
  };
  orderData: {};
}

interface stepArray {
  description: string;
  status: string;
  time: string;
  title: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = daysOfWeek[date.getDay()];

  return `${month}/${day}(${dayOfWeek}) ${hours}:${minutes}`;
}

export default function Client({ orderDetailData, orderData }: Props) {
  const params = useSearchParams();

  const [stepData, setStepData] = useState<stepArray[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrackingInfo() {
      const { shipping_company, tracking_number } = orderDetailData;
      if (shipping_company && tracking_number) {
        const data = await trackingInfoFetch({
          shippingCompanyId: shipping_company,
          trackingNumber: tracking_number,
        });
        if (data) {
          const stepData = data.map((value: DeliveryResponse) => ({
            title: `${value?.node?.status?.name} ${formatDate(value?.node?.time)}`,
            description: `${value?.node?.description} `,
            status: `${value?.node?.status?.code}`,
            time: `${value?.node?.time}`,
          }));
          setStepData(stepData);
        }
      }
      setLoading(false);
    }
    fetchTrackingInfo();
  }, [orderDetailData]);

  useEffect(() => {
    if (showAll) {
      setVisibleSteps(stepData);
    } else {
      setVisibleSteps(stepData.slice(0, 3));
    }
  }, [showAll, stepData]);

  return (
    <section className="sm:w-[650px] sm:mx-auto w-full">
      <h2 className=" font-bold text-xl py-5 px-5">배송 조회</h2>
      <div className="px-5">
        <span>
          {stepData[0]?.status === "DELIVERED"
            ? `${formatDate(stepData[0]?.time)} 배송 완료`
            : ""}
        </span>
        <div className=" w-full flex py-5">
          <div className="w-[72px] h-[86px] relative">
            <Image
              src={orderDetailData?.product?.image_url}
              alt={orderDetailData?.product?.productName}
              fill
              style={{ objectFit: "contain" }}
              className="w-full h-full  "
            />
          </div>
          <div className="flex flex-col w-[calc(100%-70px)] pl-2.5">
            <span className="text-sm">
              {orderDetailData?.product?.brandName || ""}
            </span>
            <span className="text-sm font-bold">
              {orderDetailData?.product_name || ""}
            </span>
            <div className="flex text-sm mt-0.5">
              <span>{orderDetailData?.size?.name || ""}</span>
              &nbsp; | &nbsp;
              <span>{orderDetailData?.quantity || 0}개</span>
            </div>
            <span className="text-lg font-bold">
              {orderDetailData?.price?.toLocaleString() || 0}원
            </span>
          </div>
        </div>
        <dl className="flex justify-between">
          <dt>택배사</dt>
          <dd>
            {deliveryCompanyList[orderDetailData?.shipping_company] ||
              "송장 미등록"}
          </dd>
        </dl>
        <dl className="flex justify-between">
          <dt>송장번호</dt>
          <dd>{orderDetailData?.tracking_number || "송장 미등록"}</dd>
        </dl>
        <Steps
          progressDot
          direction="vertical"
          current={0}
          items={visibleSteps}
        />
        {stepData.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full h-10 border border-secondary"
          >
            {showAll ? "접기" : "더보기"}
          </button>
        )}
      </div>
    </section>
  );
}
