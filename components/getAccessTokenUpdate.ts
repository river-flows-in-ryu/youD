// import { getCookie, setCookie } from "../utils/cookie";
"use server";

import cookieServerAction from "@/app/cookieServerAction";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function getAccessTokenUpdate() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value ?? "";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/login/refresh/`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );
    if (res.status === 200) {
      const resJson = await res.json();
      return resJson;
    } else {
      throw new Error("fetch error");
    }
  } catch (error: any) {
    if (error.message === "fetch error") {
      console.log("fetch error");
    } else {
      console.log(error);
    }
  }
}
