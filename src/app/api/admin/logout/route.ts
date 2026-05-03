import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the admin authentication cookie
  response.cookies.set("admin-auth", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: new Date(0), // This immediately expires the cookie
  });
  
  return response;
} 