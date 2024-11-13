'use client'
import { formatDate } from "@fullcalendar/core"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  allDay?: boolean
}

export function ExportCalendar({ events }: { events: CalendarEvent[] }) {
  const exportToICS = () => {
    const icsContent = events.map(event => `BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${formatDate(event.start, {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})}
DTEND:${formatDate(event.end, {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})}
DESCRIPTION:${event.description || ''}
END:VEVENT`).join('\n')

    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\n${icsContent}\nEND:VCALENDAR`], 
      { type: 'text/calendar' })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'calendar.ics'
    link.click()
  }

  return (
    <button 
      onClick={exportToICS}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
    >
      Export Calendar
    </button>
  )
}
