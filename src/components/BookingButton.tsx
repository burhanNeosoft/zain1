'use client';

import { useState } from 'react';
import BookingConfirmationModal from './BookingConfirmationModal';

interface BookingButtonProps {
  amount: number;
  slotId: string;
}

export default function BookingButton({ amount, slotId }: BookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
      >
        Confirm Booking
      </button>

      <BookingConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        amount={amount}
        slotId={slotId}
      />
    </>
  );
}