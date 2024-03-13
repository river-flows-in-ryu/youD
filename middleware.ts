import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import getAccessTokenUpdate from "./components/getAccessTokenUpdate";

export async function middleware(request: NextRequest) {
  let accessCookie = request.cookies.get("access_token")?.value;

  if (!accessCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const verifyResult = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/login/verify/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Token: accessCookie }),
    }
  );
  if (verifyResult.status === 401) {
    const getAccessTokenResult = await getAccessTokenUpdate();
    if (getAccessTokenResult === "SUCCESS") {
      const response = NextResponse.next();
      return response;
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/goods/:path*"],
};
