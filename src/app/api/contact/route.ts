import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, phone, languages, message } = await req.json();
  console.log("process.env.GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID)

  // Configure your Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "burhanuddin.neosoft@gmail.com",
      pass: process.env.GOOGLE_APP_PASS, // Use Gmail App Password, not your main password
    },
  });


    /* const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "burhanuddin.neosoft@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
    }); */

  try {
    await transporter.sendMail({
      from: email,
      to: "zainab786jodiya@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Comfortable Language(s):</strong> ${languages.join(",")}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}