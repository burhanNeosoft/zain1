import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
  const { name, email, phone, languages, message } = await req.json();
  

  try {
    // Connect to MongoDB
    await connectDB();
    
    // Save contact data to MongoDB
    const contact = new Contact({
      name,
      email,
      phone,
      languages,
      message,
    });

    //console.log('Contact data being saved:', { name, email, phone, languages, message });
    await contact.save();

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

    // Send email
    /* await transporter.sendMail({
      from: email,
      to: "zainab786jodiya@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Comfortable Language(s):</strong> ${languages.join(",")}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    }); */

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      contactId: contact._id 
    });
    
  } catch (error: any) {
    //console.error('Error in contact API:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        success: false, 
        error: `Validation failed: ${validationErrors.join(', ')}` 
      }, { status: 400 });
    }
    
    // Handle other MongoDB errors
    if (error.code === 121) {
      console.log('Error in contact API:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        success: false, 
        error: 'Document validation failed. Please check all required fields.' 
      }, { status: 400 });
    }
    
    const errorMessage = error.message || "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const contacts = await (Contact as any).find({})
      .sort({ createdAt: -1 })
      .select('-__v');
    
    return NextResponse.json({ 
      success: true, 
      contacts 
    });
    
  } catch (error: unknown) {
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : "An unknown error occurred";
    
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}