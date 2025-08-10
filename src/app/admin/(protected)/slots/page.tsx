import SlotManagement from "./SlotManagement";

export default function AdminSlots() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Slot Management</h1>
        <p className="text-gray-600 mt-2">Manage available time slots for client bookings</p>
      </div>
      
      <SlotManagement />
    </>
  );
} 