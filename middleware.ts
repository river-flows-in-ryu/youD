// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import getAccessTokenUpdate from "./components/getAccessTokenUpdate";

// export async function middleware(request: NextRequest) {
//   let accessCookie = request.cookies.get("access_token")?.value;
//   let refreshCookie = request.cookies.get("refresh_token")?.value;

//   if (!refreshCookie) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
//   const verifyResult = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/login/verify/`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token: refreshCookie }),
//     }
//   );
//   if (verifyResult.status === 200) {
//     if (accessCookie) {
//       return NextResponse.next();
//     }
//     const getAccessTokenResult = await getAccessTokenUpdate();
//     const response = NextResponse.next();
//     response.cookies.set("access_token", getAccessTokenResult.access, {
//       maxAge: 1800,
//     });
//     return response;
//   } else {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }
// export const config = {
//   matcher: ["/cart", "/mypage"],
// };

import { NextResponse, NextRequest } from "next/server";
import getAccessTokenUpdate from "./components/getAccessTokenUpdate";

export async function middleware(request: NextRequest) {
  let accessCookie = request.cookies.get("access_token")?.value;
  let refreshCookie = request.cookies.get("refresh_token")?.value;

  let debugHeaders: Record<string, string> = {
    "X-Debug-Access-Token": accessCookie || "undefined",
    "X-Debug-Refresh-Token": refreshCookie || "undefined",
  };

  // Function to add debug headers to the response
  const addDebugHeaders = (response: NextResponse) => {
    response.headers.set(
      "X-Debug-Access-Token",
      debugHeaders["X-Debug-Access-Token"]
    );
    response.headers.set(
      "X-Debug-Refresh-Token",
      debugHeaders["X-Debug-Refresh-Token"]
    );
    if (debugHeaders["X-Debug-Verify-Result-Status"]) {
      response.headers.set(
        "X-Debug-Verify-Result-Status",
        debugHeaders["X-Debug-Verify-Result-Status"]
      );
    }
    return response;
  };

  if (!refreshCookie) {
    let response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("X-Debug-Action", "redirect_no_refresh_token");
    return addDebugHeaders(response);
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

  debugHeaders["X-Debug-Verify-Result-Status"] = verifyResult.status.toString();

  if (verifyResult.status === 200) {
    if (accessCookie) {
      let response = NextResponse.next();
      response.headers.set("X-Debug-Action", "next_with_access_token");
      return addDebugHeaders(response);
    }
    const getAccessTokenResult = await getAccessTokenUpdate();
    let response = NextResponse.next();
    response.cookies.set("access_token", getAccessTokenResult.access, {
      maxAge: 1800,
    });
    response.headers.set("X-Debug-Action", "next_with_new_access_token");
    return addDebugHeaders(response);
  } else {
    let response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("X-Debug-Action", "redirect_invalid_refresh_token");
    return addDebugHeaders(response);
  }
}

export const config = {
  matcher: ["/cart"],
};
