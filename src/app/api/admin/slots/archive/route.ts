import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Slot from "@/models/Slot";

// GET - Fetch all slots for admin
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
    let query: any = { markAttended: true };
    if (date) {
      query = { ...query, date };
    }
    
    const slots = await Slot.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookedBy',
          foreignField: '_id',
          as: 'booking'
        }
      },
      {
        $addFields: {
          booking: { $arrayElemAt: ['$booking', 0] }
        }
      },
      { $sort: { date: 1, time: 1 } }
    ]);
    
    return NextResponse.json({ 
      success: true, 
      slots 
    });
    
  } catch (error: any) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}