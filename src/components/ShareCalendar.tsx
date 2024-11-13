'use client'

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

export function ShareCalendar({ event }: { event: CalendarEvent }) {
  const shareEvent = async () => {
    const shareData = {
      title: event.title,
      text: `Join my event: ${event.title}`,
      url: `${window.location.origin}/calendar?event=${event.id}`
    }
    
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareData.url)
    }
  }

  return (
    <button 
      onClick={shareEvent}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
    >
      Share Event
    </button>
  )
}
