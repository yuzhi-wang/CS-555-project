import React, { useState, useEffect,useRef } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { query, collection, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';

const localizer = momentLocalizer(moment)

const GroundteamCalendar = () => {
//   const [events1, setEvents1] = useState([
//     {
//       title: 'Event 1',
//       start: new Date('2023-04-25T10:00:00'),
//       end: new Date('2023-04-25T11:00:00'),
//     },
//     {
//       title: 'Event 2',
//       start: new Date('2023-04-25T09:30:00'),
//       end: new Date('2023-04-25T13:00:00'),
//     },
//   ])
  const [events, setEvents] = useState([
    
  ])
  const today1 = new Date()
  
  const dailyStart = moment(today1).startOf('day').add(6, 'hours').toDate();

  const dailyEnd = moment(today1).startOf('day').add(22, 'hours').toDate();
  
  const [view, setView] = useState(Views.WEEK);
  const auth = getAuth();
  

  const handleViewChange = view => {
    setView(view);
  };

  const handleUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate >= today && eventDate < nextWeek
    })

    if (upcomingEvents.length > 0) {
        setTimeout(() => {
            alert(`You have ${upcomingEvents.length} events coming up soon!`)
          }, 500)
    }
    
  }

  useEffect(() => {
    
    const fetchInfo = async () => {
        if (auth.currentUser){
            let arr = []
            const q = query(collection(db, "ticket"), where("groundteamid", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                arr.push({id:doc.id, data: doc.data()});
            });
        
        const currentEvents = arr.map(ticket => ({
            title: `Ticket ${ticket.id}`,
            start: new Date(ticket.data.date + "T" + ticket.data.startTime + ":00"),
            end: new Date(ticket.data.date + "T" + ticket.data.endTime + ":00"),
          }));
          setEvents(currentEvents);
          
        }
    };
    fetchInfo();
    
  },  [])
  useEffect(() => {
    // console.log(events);
    // console.log(events1);
    handleUpcomingEvents();
  }, [events]);

  return (
    <div>
    <div className="text-xl font-bold">Calendar</div>
    <div style={{ width: "100%", margin: "0 auto" }}>
    
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
