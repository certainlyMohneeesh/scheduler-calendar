'use client'
import { useEffect, useState } from 'react'
import { useToast } from "@/components/ui/use-toast"

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  description?: string;
}


export function EventNotifications({ events }: { events: CalendarEvent[] }) {

  const { toast } = useToast()
  const [permission, setPermission] = useState('default')

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(perm => setPermission(perm))
    }
  }, [])

  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date()
      const upcoming = events.filter(event => {
        const eventTime = new Date(event.start)
        const timeDiff = eventTime.getTime() - now.getTime()
        return timeDiff > 0 && timeDiff < 1800000 // 30 minutes
      })
      
      upcoming.forEach(event => {
        if (permission === 'granted') {
          new Notification(`Upcoming Event: ${event.title}`, {
            body: `Starting in 30 minutes`
          })
        } else {
          // Fallback to toast notification
          toast({
            title: 'Upcoming Event',
            description: `${event.title} starting in 30 minutes`
          })
        }
      })
    }

    // Check every minute
    const interval = setInterval(checkUpcomingEvents, 60000)
    return () => clearInterval(interval)
  }, [events, permission])

  return null
}
