"use client";

import React, { useState, useEffect,  } from "react";
// import ErrorBoundary from './ErrorBoundary';
// import listPlugin from '@fullcalendar/list'
import dynamic from 'next/dynamic'
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  CalendarOptions
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { ShareCalendar } from "./ShareCalendar";
// import { ExportCalendar } from "./ExportCalendar";

interface CalendarProps extends Partial<CalendarOptions> {
  events: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
  }>;
  onSelectEvent: (event: any) => void;
  onSelectSlot: (slotInfo: any) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

const DynamicFullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
  loading: () => <div>Loading calendar...</div>
})

// function CalendarFallback() {
//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-pulse text-xl">Loading calendar...</div>
//     </div>
//   )
// }

// function ErrorFallback() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-xl font-bold mb-4">Calendar is taking a break</h2>
//       <button
//         onClick={() => window.location.reload()}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Refresh Page
//       </button>
//     </div>
//   )
// }

const Calendar: React.FC<CalendarProps> = () => {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false);
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calendarEvents')
      return saved ? JSON.parse(saved) : []
    }
    return []
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      const events = JSON.parse(savedEvents);
      setCurrentEvents(events);
    }
  }, []);
  


 if (!mounted) return null;

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    const event = selected.event;
    if (window.confirm(`Are you sure you want to delete the event "${selected.event.title}"?`)) {
      selected.event.remove();
      const updatedEvents = currentEvents.filter(event => event.id !== selected.event.id);
      setCurrentEvents(updatedEvents);
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent: CalendarEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      const updatedEvents = [...currentEvents, newEvent];
      setCurrentEvents(updatedEvents);
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

      calendarApi.addEvent(newEvent);
      
      toast({
        title: "Event Added!",
        description: `${newEventTitle} has been scheduled successfully.`,
      });
      
      handleCloseDialog();
    }
};

const handleEventDrop = (info: EventDropArg) => {
  try {
    const updatedEvents: CalendarEvent[] = currentEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: info.event.id === event.id ? new Date(info.event.start!) : new Date(event.start!),
      end: info.event.id === event.id ? new Date(info.event.end!) : new Date(event.end!),
      allDay: event.allDay
    }));

    setCurrentEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    
    toast({
      title: "Event Updated",
      description: `${info.event.title} has been rescheduled.`,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    toast({
      title: "Error",
      description: "Failed to update event. Please try again.",
      variant: "destructive"
    });
  }
};


  return (
    // <ErrorBoundary fallback={<ErrorFallback />}>
    <div>
      <div className="flex flex-col lg:flex-row w-full px-4 lg:px-10 justify-start items-start gap-8">
        <div className="w-full lg:w-3/12 mb-6 lg:mb-0">
          <div className="py-6 lg:py-10 text-xl lg:text-2xl font-extrabold px-4 lg:px-7">
            Calendar Events
          </div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italic text-center text-gray-400">
                No Events Present
              </div>
            )}
            {currentEvents.length > 0 &&
              currentEvents.map((event: any) => (
                <li
                  className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                  key={event.id}
                >
                  {event.title}
                  <br />
                  <label className="text-slate-950">
                    {formatDate(event.start, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-full lg:w-9/12">
          <DynamicFullCalendar
            height={"auto"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            editable={true}
            droppable={true}
            eventDrop={handleEventDrop}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            views={{
              dayGridMonth: { titleFormat: { month: 'long', year: 'numeric' } },
              timeGridWeek: { titleFormat: { month: 'long', year: 'numeric' } },
              timeGridDay: { titleFormat: { month: 'long', day: 'numeric', year: 'numeric' } },
              listWeek: { buttonText: 'List View' },
              listMonth: { buttonText: 'Monthly List' }
            }}
            initialView={window.innerWidth < 768 ? "timeGridDay" : "dayGridMonth"}
            select={handleDateClick}
            eventClick={handleEventClick}
            contentHeight="auto"
            aspectRatio={1.35}
            handleWindowResize={true}
            events={currentEvents.map((event: CalendarEvent) => ({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              allDay: event.allDay
            }))}
          />
          {/* <ExportCalendar events={currentEvents} /> */}
        </div>
        {/* <div>
    {eventInfo && <ShareCalendar event={eventInfo} />}
  </div> */}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
              className="border border-gray-200 p-3 rounded-md text-lg"
            />
            <button
              className="bg-green-500 text-white p-3 mt-5 rounded-md"
              type="submit"
            >
              Add
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    // </ErrorBoundary>
  );
};

export default Calendar;
