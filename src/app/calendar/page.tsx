'use client'

import { useState, useEffect } from 'react'
import Calendar from '@/components/Calendar'
import { useSession } from 'next-auth/react'
import AddEventModal from '@/components/AddEventModal'
import { EventNotifications } from '@/components/EventNotifications'

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

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
      <EventNotifications events={events} />
    </div>
  )
}
