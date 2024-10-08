import React, { useState } from 'react';
import { Users, Clipboard, BarChart2,  CheckCircle2 , Clock} from 'lucide-react';
import CardFormationt from './CardFormationt'; 

const Dashboard = () => {
  const [totalMentors, setTotalMentors] = useState(10);
  const [currentFormation, setCurrentFormation] = useState(5);
  const [numberOfFormation, setNumberOfFormation] = useState(6);

  const currentFormations = [
    { id: 1, title: 'React Basics', date: '2024-10-01', description: 'Learn the basics of React.', type: 'Workshop', mentors: 'John Doe' },
    { id: 2, title: 'Node.js Essentials', date: '2024-10-02', description: 'Introduction to Node.js.', type: 'Webinar', mentors: 'Jane Smith' },
    { id: 3, title: 'MongoDB Mastery', date: '2024-10-03', description: 'Become a MongoDB expert.', type: 'Course', mentors: 'Alice Johnson' },
  ];

  const upcomingFormations = [
    { id: 1, title: 'Advanced React', date: '2024-11-01', description: 'Deep dive into advanced React topics.', type: 'Workshop', mentors: 'Chris Lee'},
    { id: 2, title: 'GraphQL Workshop', date: '2024-11-05', description: 'Learn how to use GraphQL.', type: 'Workshop', mentors: 'Sara Brown' },
    { id: 3, title: 'Next.js Deep Dive', date: '2024-11-10', description: 'Explore Next.js in-depth.', type: 'Course', mentors: 'Mark Wilson' },
  ];


  

  return (
    <div className="grid mt-8 gap-6 px-4 sm:px-0">
      {/* First Row: 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-9 bg-white p-6 rounded-lg">

        {/* Total Mentors */}
        <div className="p-8 shadow-lg rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 text-white flex items-center transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white p-4 rounded-full mr-4 shadow-lg">
            <Users className="text-blue-500 w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold">Total Mentors</p>
            <h2 className="text-3xl font-bold">{totalMentors}</h2>
          </div>
        </div>

        {/* Current Formations */}
        <div className="p-8 shadow-lg rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white flex items-center transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white p-4 rounded-full mr-4 shadow-lg">
            <Clipboard className="text-yellow-500 w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold">Current Formations</p>
            <h2 className="text-3xl font-bold">{currentFormation}</h2>
          </div>
        </div>

        {/* Number of Formations */}
        <div className="p-8 shadow-lg rounded-xl bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white p-4 rounded-full mr-4 shadow-lg">
            <BarChart2 className="text-green-500 w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold">Number of Formations</p>
            <h2 className="text-3xl font-bold">{numberOfFormation}</h2>
          </div>
        </div>
      </div>

      {/* Second Row: Tables and Donut Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Left Column: Stacked Tables */}
        <div className="space-y-6">
          {/* Current Formation Table */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Current Formation</h3>
            <div className="overflow-y-auto h-48">
              {currentFormations.map(event => (
                <CardFormationt 
                  key={event.id}
                  icon={<CheckCircle2/>}
                  title={event.title}
                  date={event.date}
                  description={event.description}
                  type={event.type}
                  mentors={event.mentors}
                />
              ))}
            </div>
          </div>

          {/* Upcoming Formation Table */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Formation</h3>
            <div className="overflow-y-auto h-48">
              {upcomingFormations.map(event => (
                <CardFormationt 
                  key={event.id}
                  icon={<Clock/>}
                  title={event.title}
                  date={event.date}
                  description={event.description}
                  type={event.type}
                  mentors={event.mentors}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Donut Chart Placeholder */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-center">
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-gray-500">[Donut Chart Placeholder]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
