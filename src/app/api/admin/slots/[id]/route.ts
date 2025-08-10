import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const slot = await (Slot as any).findById(id);
    
    if (!slot) {
      return NextResponse.json(
        { success: false, error: 'Slot not found' },
        { status: 404 }
      );
    }
    
    if (slot.isBooked) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete booked slot' },
        { status: 400 }
      );
    }
    
    await (Slot as any).findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Slot deleted successfully' 
    });
    
  } catch (error: any) {
    console.error('Error deleting slot:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
} 