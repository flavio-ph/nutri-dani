import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { BookingModal } from '../components/ui/BookingModal';

interface BookingContextType {
  openBookingModal: () => void;
  closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookingContext.Provider value={{
      openBookingModal: () => setIsOpen(true),
      closeBookingModal: () => setIsOpen(false)
    }}>
      {children}
      <AnimatePresence>
         {isOpen && <BookingModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
