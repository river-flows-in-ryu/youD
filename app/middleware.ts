import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import isTokenExpired from "../components/isTokenExpired";
import getAccessTokenUpdate from "../components/getAccessTokenUpdate";

export async function middleware(request: NextRequest) {
  let accessCookie = request.cookies.get("access_token");
  if (accessCookie && isTokenExpired(accessCookie.value)) {
    const res = await getAccessTokenUpdate();
    if (res === "SUCCESS") {
      const response = NextResponse.next();
      return response;
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
export const config = {
  matcher: ["/login", "/goods/:path*"],
};
