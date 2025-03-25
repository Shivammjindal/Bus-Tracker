import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    return res;
}