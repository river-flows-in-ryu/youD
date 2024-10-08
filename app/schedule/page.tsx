import React from "react";

import Container from "@/components/container";
import Client from "./client";
import { commonFetch } from "@/utils/commonFetch";

export default async function Page() {
  async function fetchSchedule() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedule`,
      "get"
    );
    return res;
  }
  const scheduleData = await fetchSchedule();
  return (
    <Container>
      <div className="w-full h-full sm:w-[650px] sm:mx-auto">
        <Client scheduleData={scheduleData} />
      </div>
    </Container>
  );
}
