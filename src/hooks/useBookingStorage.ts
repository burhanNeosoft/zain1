'use client';

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
}

const STORAGE_KEY = 'bookingDetails';

export function useBookingStorage() {
  const saveBookingDetails = (details: BookingDetails) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  };

  const getBookingDetails = (): BookingDetails | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  };

  const clearBookingDetails = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    saveBookingDetails,
    getBookingDetails,
    clearBookingDetails,
  };
}