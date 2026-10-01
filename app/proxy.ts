// middleware.ts

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/my-profile",
    "/posts/create",
];

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token");

    const pathname = request.nextUrl.pathname;

    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    if (isProtected && !accessToken) {
        return NextResponse.redirect(
            new URL("/auth", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/my-profile/:path*",
        "/posts/create/:path*",
    ],
};