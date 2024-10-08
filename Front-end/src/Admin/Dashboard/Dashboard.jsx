import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Clipboard, BarChart2, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import CardFormationt from './CardFormationt';

const Dashboard = () => {
  const [totalMentors, setTotalMentors] = useState(null);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [numberOfFormation, setNumberOfFormation] = useState(null);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorsResponse = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/totalmentors`, { withCredentials: true });
        setTotalMentors(mentorsResponse.data.totalMentors);
  
        const formationsResponse = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/Totalformations`, { withCredentials: true });
        setNumberOfFormation(formationsResponse.data.totalCourses);
  
        const currentResponse = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/GetCurrentFormations`, { withCredentials: true });
        setCurrentFormation(currentResponse.data.currentFormations);
  
        const allFormation = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/GetFormations`, { withCredentials: true });
        setAllCourses(allFormation.data.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-6">
          <Card className="overflow-hidden shadow-xl rounded-lg">
            <CardHeader className="bg-gradient-to-br from-gray-800 to-black text-white py-4">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2" /> Current Events
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto bg-white">
              {allCourses && allCourses.length > 0 ? (
                allCourses.map((course) => (
                  <div key={course._id} className="py-4 flex items-start space-x-4">
                    <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: <span className="font-medium text-orange-700">{course.type}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Mentors:{" "}
                        <span className="font-medium text-orange-700">{course.mentors.map((mentor) => mentor.email).join(", ")}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                        In Progress
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No current events found.</p>
              )}
            </CardContent>
          </Card>

              <Card className="overflow-hidden shadow-xl rounded-lg">
              <CardHeader className="bg-gradient-to-br from-gray-800 to-black text-white py-4">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Calendar className="mr-2" /> Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto bg-white">
                {allCourses && allCourses.length > 0 ? (
                  allCourses.map((course) => (
                    <div key={course._id} className="py-4 flex items-start space-x-4">
                      <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">
                          {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Type: <span className="font-medium text-orange-700">{course.type}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Mentors:{" "}
                          <span className="font-medium text-orange-700">{course.mentors.map((mentor) => mentor.email).join(", ")}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                          In Progress
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500">No Upcoming events found.</p>
                )}
              </CardContent>
            </Card>
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
