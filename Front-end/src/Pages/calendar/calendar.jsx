import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Calendary = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`,
          { credentials: 'include' }
        );
        const data = await response.json();

        const formattedEvents = data.map((course) => ({
          id: course._id,
          title: course.title,
          start: new Date(course.startDate),
          end: new Date(course.endDate),
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching formations:', error);
      }
    };

    fetchFormations();
  }, []);

  return (
    <div className="h-screen p-4 sm:p-6 lg:p-8 m-3">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Planning</h1>
      <div className="h-full overflow-hidden rounded-lg shadow bg-white  mb-5">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default Calendary;
