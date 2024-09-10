import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar' // Make sure this import is correct
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css' // Import calendar styles
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

const Calendary = () => {
    const [view, setView] = useState('month')
    const [events, setEvents] = useState([])
  
    useEffect(() => {
      // Fetch formations (courses) from the backend API
      const fetchFormations = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/courses/GetFormations`,
          { withCredentials: true });
          const data = await response.json();
  
          // Map the data to the format required by react-big-calendar
          const formattedEvents = data.map(course => ({
            id: course._id,
            title: course.title,
            start: new Date(course.startDate),
            end: new Date(course.endDate),
            mentors: course.mentors.map(mentor => mentor.email).join(', ')
          }));
  
          setEvents(formattedEvents);
        } catch (error) {
          console.error('Error fetching formations:', error);
        }
      };
  
      fetchFormations();
    }, []);
  
    const handleViewChange = (newView) => {
      setView(newView)
    }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Planning</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={handleViewChange} defaultValue={view}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={(newView) => setView(newView)}
              toolbar={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

export default Calendary;