import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css'

const localizer = momentLocalizer(moment);

// Function to generate a random color
const getRandomOrangeShade = () => {
  const shadesOfOrange = [
    '#FFA500', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500', '#FFD700',
    '#2C3E50', '#34495E', '#1ABC9C', '#16A085', '#2980B9', '#8E44AD',
    '#E74C3C', '#27AE60'
  ];
  // Randomly pick one of the orange shades
  const randomIndex = Math.floor(Math.random() * shadesOfOrange.length);
  return shadesOfOrange[randomIndex];
};

const Calendary = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormations`,
          { credentials: 'include' }
        );
        const data = await response.json();

        const formattedEvents = data.map((course) => ({
          id: course._id,
          title: course.title,
          start: new Date(course.startDate),
          end: new Date(course.endDate),
          color: getRandomOrangeShade() ,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching formations:', error)
      }
    };

    fetchFormations();
  }, []);

  // Function to style each event
  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || '#3174ad'; // Default color if not provided
    return {
      style: {
        backgroundColor,
        borderRadius: '0px',
        opacity: 0.9, 
        color: 'white',
        border: 'none',
        padding: '0 4px', 
        whiteSpace: 'nowrap',      
        overflow: 'hidden',       
        textOverflow: 'ellipsis',  
        minWidth: '0',             
        fontSize: '1rem',
      },
    };
  };

  return (
    <div className="h-screen p-4 sm:p-6 lg:p-8 m-3">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Planning</h1>
      <div className="h-full overflow-hidden rounded-lg mb-5">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter} // Apply custom styles to events
        />
      </div>
    </div>
  );
};

export default Calendary;