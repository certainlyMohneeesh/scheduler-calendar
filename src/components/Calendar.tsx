"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic'
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
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

const DynamicFullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false
});

const Calendar: React.FC = () => {
  const calendarRef = useRef<any>(null);
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false);
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
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

      const newEvent = {
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

  return (
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
            ref={calendarRef}
            height={"auto"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            views={{
              dayGridMonth: {
                titleFormat: { month: 'long', year: 'numeric' }
              },
              timeGridWeek: {
                titleFormat: { month: 'long', year: 'numeric' }
              },
              timeGridDay: {
                titleFormat: { month: 'long', day: 'numeric', year: 'numeric' }
              }
            }}
            initialView={window.innerWidth < 768 ? "timeGridDay" : "dayGridMonth"}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents}
            contentHeight="auto"
            aspectRatio={1.35}
            handleWindowResize={true}
          />
        </div>
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
  );
};

export default Calendar;
