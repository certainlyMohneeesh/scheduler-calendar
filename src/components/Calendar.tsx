import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarProps {
  events: Array<{
    title: string
    start: Date
    end: Date
  }>
  onSelectEvent: (event: any) => void
  onSelectSlot: (slotInfo: any) => void
}

export default function Calendar({ events, onSelectEvent, onSelectSlot }: CalendarProps) {
  return (
    <div className="h-[600px] mt-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        views={['month', 'week', 'day']}
      />
    </div>
  )
}
