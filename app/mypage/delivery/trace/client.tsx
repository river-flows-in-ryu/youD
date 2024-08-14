"use client";

import React, { useEffect, useState } from "react";

import { Steps } from "antd";
import { useSearchParams } from "next/navigation";

import trackingInfoFetch from "./dataFetch";

interface DeliveryResponse {
  node: {
    description: string;
    status: {
      name: string;
    };
    time: string;
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = daysOfWeek[date.getDay()];

  return `${month}/${day}(${dayOfWeek}) ${hours}:${minutes}`;
}

export default function Client() {
  const params = useSearchParams();

  const [shippingCompanyId, setShippingCompanyId] = useState<string | null>("");
  const [trackingNumber, setTrackingNumber] = useState<string | null>("");

  const [stepData, setStepData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    setShippingCompanyId(params?.get("shippingCompany"));
    setTrackingNumber(params?.get("trackingNo"));
  }, [params]);

  useEffect(() => {
    async function fetchTrackingInfo() {
      if (shippingCompanyId && trackingNumber) {
        const data = await trackingInfoFetch({
          shippingCompanyId,
          trackingNumber,
        });
        console.log(data);
        if (data) {
          const stepData = data.map((value: DeliveryResponse) => ({
            title: `${value?.node?.status?.name} ${formatDate(value?.node?.time)}`,
            description: `${value?.node?.description} `,
          }));
          setStepData(stepData);
        }
      }
    }
    fetchTrackingInfo();
  }, [shippingCompanyId, trackingNumber]);

  useEffect(() => {
    if (showAll) {
      setVisibleSteps(stepData);
    } else {
      setVisibleSteps(stepData.slice(0, 3));
    }
  }, [showAll, stepData]);

  // console.log(visibleSteps);
  return (
    <section className="sm:w-[650px] sm:mx-auto w-full">
      <h2 className=" font-bold text-xl py-5 px-5">배송 조회</h2>
      <div className="px-5">
        <Steps direction="vertical" current={0} items={visibleSteps} />
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
