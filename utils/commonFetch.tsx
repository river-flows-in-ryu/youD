// import { cookies } from "next/headers";

export const commonFetch = async (
  url: string,
  method: string,
  payload?: any
): Promise<any> => {
  try {
    // const cookieStore = cookies();
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer${cookieStore.get("access_token")?.value}` ?? "",
        withcredentials: "include",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, options);
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData;
    }
  } catch (error) {
    console.log(error, "commonFetch catch부분");
  }
};
