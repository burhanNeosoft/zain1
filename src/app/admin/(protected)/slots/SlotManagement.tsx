"use client";
import { useState, useEffect } from "react";

interface Slot {
  _id: string;
  date: string;
  time: string;
  isBooked: boolean;
  isActive: boolean;
  bookedBy?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function SlotManagement() {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTimes, setNewTimes] = useState<string[]>([""]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Generate next 14 days
  const generateNextDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  // Predefined time slots
  const predefinedTimes = [
    "09:00-09:30", "09:30-10:00", "10:00-10:30", "10:30-11:00",
    "11:00-11:30", "11:30-12:00", "12:00-12:30", "12:30-13:00",
    "13:00-13:30", "13:30-14:00", "14:00-14:30", "14:30-15:00",
    "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00",
    "17:00-17:30", "17:30-18:00", "18:00-18:30", "18:30-19:00"
  ];

  const fetchSlots = async (date?: string) => {
    setLoading(true);
    try {
      const url = date ? `/api/admin/slots?date=${date}` : '/api/admin/slots';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setSlots(data.slots);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddTime = () => {
    setNewTimes([...newTimes, ""]);
  };

  const handleRemoveTime = (index: number) => {
    setNewTimes(newTimes.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const updatedTimes = [...newTimes];
    updatedTimes[index] = value;
    setNewTimes(updatedTimes);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleCreateSlots = async () => {
    if (!selectedDate || newTimes.some(time => !time)) {
      alert('Please select a date and fill all time slots');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          times: newTimes.filter(time => time.trim())
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        setShowAddForm(false);
        setNewTimes([""]);
        setSelectedDate("");
        fetchSlots();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating slots:', error);
      alert('Error creating slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;

    try {
      const response = await fetch(`/api/admin/slots/${slotId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        fetchSlots();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Error deleting slot');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Slots Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Add New Slots</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {showAddForm ? 'Cancel' : 'Add Slots'}
          </button>
        </div>

        {showAddForm && (
          <div className="space-y-4">
            {/* Date Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                  placeholder="Click to select date"
                  readOnly
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white"
                />
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  
                </button>
              </div>
              
              {/* Calendar Popup */}
              {showCalendar && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="p-3">
                    <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {generateNextDays().map((date) => {
                        const day = new Date(date).getDate();
                        const isSelected = selectedDate === date;
                        return (
                          <button
                            key={date}
                            onClick={() => handleDateSelect(date)}
                            className={`p-2 text-sm rounded-md hover:bg-gray-100 ${
                              isSelected ? 'bg-indigo-600 text-white' : 'text-gray-900'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slots
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {predefinedTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      if (!newTimes.includes(time)) {
                        setNewTimes([...newTimes.filter(t => t), time]);
                      }
                    }}
                    disabled={newTimes.includes(time)}
                    className={`p-2 text-sm border rounded-md ${
                      newTimes.includes(time)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              
              {/* Custom Time Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Time Slots (HH:MM-HH:MM format)
                </label>
                {newTimes.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="10:00-10:30"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    />
                    <button
                      onClick={() => handleRemoveTime(index)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddTime}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Add Custom Time
                </button>
              </div>
            </div>

            <button
              onClick={handleCreateSlots}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Slots'}
            </button>
          </div>
        )}
      </div>

      {/* Existing Slots Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Existing Slots</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : slots.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slots.map((slot) => (
                  <tr key={slot._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{slot.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        slot.isBooked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {slot.bookedBy ? (
                        <div className="text-sm text-gray-900">
                          <div>{slot.bookedBy.name}</div>
                          <div className="text-gray-500">{slot.bookedBy.email}</div>
                          <div className="text-gray-500">{slot.bookedBy.phone}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!slot.isBooked && (
                        <button
                          onClick={() => handleDeleteSlot(slot._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No slots</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding some time slots.</p>
          </div>
        )}
      </div>
    </div>
  );
} 