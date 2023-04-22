import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const GroundteamCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Event 1',
      start: new Date('2023-04-25T09:00:00'),
      end: new Date('2023-04-25T10:00:00'),
    },
    {
      title: 'Event 2',
      start: new Date('2023-04-25T09:30:00'),
      end: new Date('2023-04-25T13:00:00'),
    },
  ])
  const today1 = new Date()
  
  const dailyStart = moment(today1).startOf('day').add(6, 'hours').toDate();

  const dailyEnd = moment(today1).startOf('day').add(22, 'hours').toDate();
  
  const [view, setView] = useState(Views.WEEK);

  const handleViewChange = view => {
    setView(view);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.start)
        return eventDate >= today && eventDate < nextWeek
      })

      if (upcomingEvents.length > 0) {
        alert(`You have ${upcomingEvents.length} events coming up soon!`)
      }
    }, 1000 * 60 * 60)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
    <div>Calendar</div>
    <div style={{ width: "50%", margin: "0 auto" }}>
    
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        step={90}
        
        min={dailyStart}
        max={dailyEnd}
        views={{ week: true, day: true, agenda: true }}
        view={view}
        onView={handleViewChange}
        // formats={{
        //     timeGutterFormat: 'HH:mm',
        //     eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
        //       `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
        //     agendaTimeFormat: 'HH:mm',
        //     agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
        //       `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
        //   }}
        
      />
    </div>
    </div>
  )
}

export default GroundteamCalendar
