import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define ticket type for storage
interface StoredTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  ticketCode: string;
  price: string;
  image?: string;
  status: string;
  createdAt: string;
}

interface TicketsState {
  tickets: StoredTicket[];
  addTicket: (ticket: StoredTicket) => void;
  addTickets: (tickets: StoredTicket[]) => void;
  clearTickets: () => void;
  hasNewTickets: boolean;
  setHasNewTickets: (value: boolean) => void;
}

const useTicketsStore = create<TicketsState>()(
  persist(
    (set) => ({
      tickets: [],
      hasNewTickets: false,
      addTicket: (ticket) => 
        set((state) => ({ 
          tickets: [ticket, ...state.tickets],
          hasNewTickets: true
        })),
      addTickets: (newTickets) => 
        set((state) => ({ 
          tickets: [...newTickets, ...state.tickets],
          hasNewTickets: true
        })),
      clearTickets: () => set({ tickets: [] }),
      setHasNewTickets: (value) => set({ hasNewTickets: value }),
    }),
    {
      name: 'tickets-storage',
    }
  )
);

export default useTicketsStore;