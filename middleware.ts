import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import getAccessTokenUpdate from "./components/getAccessTokenUpdate";

export async function middleware(request: NextRequest) {
  let accessCookie = request.cookies.get("access_token")?.value;
  if (accessCookie) {
    const verifyResult = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/login/verify/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessCookie }),
      }
    );
    if (verifyResult.status === 401) {
      const getAccessTokenResult = await getAccessTokenUpdate();
      if (getAccessTokenResult === "SUCCESS") {
        const response = NextResponse.next();
        return response;
      }
    }
    if (verifyResult.status === 200) {
      const response = NextResponse.next();
      return response;
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
export const config = {
  matcher: ["/goods/:path*"],
};
