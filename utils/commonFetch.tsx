import { cookies } from "next/headers";

import getAccessTokenUpdate from "@/components/getAccessTokenUpdate";

export const commonFetch = async (
  url: string,
  method: string,
  payload?: any
): Promise<any> => {
  try {
    const cookieStore = cookies();
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer${cookieStore.get("access_token")?.value}` ?? "",
      },
      body: JSON.stringify(payload),
    };
    console.log(cookieStore.get("access_token")?.value);
    const response = await fetch(url, options);
    console.log(response.status);
    if (response.status === 401) {
      const result = await getAccessTokenUpdate();
      if (result === "SUCCESS") {
        return commonFetch(url, method, payload);
      } else {
        throw new Error("fetch error");
      }
    } else {
      return response.json();
    }
  } catch (error) {
    console.log(error, "catch부분");
  }
};
