import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Slot from "@/models/Slot";

// GET - Fetch all slots for admin
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
    let query: any = { isActive: true };
    if (date) {
      query = { ...query, date };
    }
    
    /* const slots = await Slot.find(query)
      .sort({ date: 1, time: 1 })
      .populate('bookedBy', 'name email phone'); */

      

    const slots = await Slot.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'bookings', // collection name (lowercase, plural)
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

// POST - Create new slots
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { date, times } = await req.json();
    
    if (!date || !times || !Array.isArray(times)) {
      return NextResponse.json(
        { success: false, error: 'Date and times array are required' },
        { status: 400 }
      );
    }
    
    const slots = [];
    for (const time of times) {
      try {
        const slot = new Slot({ date, time });
        await slot.save();
        slots.push(slot);
      } catch (error: any) {
        if (error.code === 11000) {
          // Duplicate slot, skip it
          continue;
        }
        throw error;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: slots.length > 0 ? `${slots.length} slots created successfully` : 'No slots created',
      slots 
    });
    
  } catch (error: any) {
    console.error('Error creating slots:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

export async function test() {
  await connectDB();
  const slots = await Slot.find().populate('bookedBy');
  console.log(slots);
}