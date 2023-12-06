import { NextRequest, NextResponse } from "next/server";

// they're not really supposed to be on this page. I'll redirect them to the dashboard if they do land here (because we don't know which checker they want to create)
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest): NextResponse | void {
    if (request.nextUrl.pathname === "/create/check") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
}

export const config = {
    matcher: "/create/check",
};
