import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import getAccessTokenUpdate from "./components/getAccessTokenUpdate";

export async function middleware(request: NextRequest) {
  let accessCookie = request.cookies.get("access_token")?.value;
  let refreshCookie = request.cookies.get("refresh_token")?.value;

  if (!refreshCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const verifyResult = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/login/verify/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshCookie }),
    }
  );
  if (verifyResult.status === 200) {
    if (accessCookie) {
      return NextResponse.next();
    }
    const getAccessTokenResult = await getAccessTokenUpdate();
    const response = NextResponse.next();
    response.cookies.set("access_token", getAccessTokenResult.access, {
      maxAge: 1800,
    });
    return response;
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/cart"],
};
