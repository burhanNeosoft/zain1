import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Set a simple cookie for session (for demo; use JWT or secure session in production)
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-auth", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      // secure: true, // Uncomment in production
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}