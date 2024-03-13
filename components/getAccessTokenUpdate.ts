// import { getCookie, setCookie } from "../utils/cookie";
import { cookies } from "next/headers";

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
        body: JSON.stringify({ Refresh: refreshToken }),
      }
    );
    if (res.status === 200) {
      const { access_token } = await res.json();
      cookieStore.set("access_token", access_token);
      return "SUCCESS";
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
