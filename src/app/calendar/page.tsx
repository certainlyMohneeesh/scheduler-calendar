'use client'

import { useState, useEffect } from 'react'
import Calendar from '@/components/Calendar'
import { useSession } from 'next-auth/react'
import AddEventModal from '@/components/AddEventModal'
// import { EventNotifications } from '@/components/EventNotifications'
import ErrorBoundary from '@/components/ErrorBoundary'

// interface CalendarProps {
//   events: CalendarEvent[];
//   onSelectEvent: (event: CalendarEvent) => void;
//   onSelectSlot: (slotInfo: any) => void;
// }

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

// function ErrorFallback() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-xl font-bold mb-4">Schedule is taking a break</h2>
//       <button 
//         onClick={() => window.location.reload()}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Refresh Page
//       </button>
//     </div>
//   )
// }


export default function CalendarPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Fetch events from API
    fetchEvents()
  }, [session])

  const fetchEvents = async () => {
    if (!session?.user?.email) return
    const response = await fetch('/api/schedules')
    const data = await response.json()
    setEvents(data)
  }

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedEvent(undefined)
    setIsModalOpen(true)
  }

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
      {/* <ErrorBoundary fallback={<ErrorFallback />}> */}

      <Calendar
        events={events}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
      {isModalOpen && (
        <AddEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          onSave={fetchEvents}
        />
        
      )}
      {/* <EventNotifications events={events} /> */}
      {/* </ErrorBoundary> */}
    </div>
  )
}
