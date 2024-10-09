import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Clipboard, BarChart2, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import CardFormationt from './CardFormationt';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const Dashboard = () => {
  const [totalMentors, setTotalMentors] = useState(null);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [numberOfFormation, setNumberOfFormation] = useState(null);
  const [current, setCurrent] = useState([]);
  const [upcoming, setUpComing] = useState([]);
  const [data, setData] = useState({
    totalCandidates: 0,
    confirmedCandidates: 0,
    confirmationRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorsResponse = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/totalmentors`, { withCredentials: true });
        setTotalMentors(mentorsResponse.data.totalMentors);
  
        const formationsResponse = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/Totalformations`, { withCredentials: true });
        setNumberOfFormation(formationsResponse.data.totalCourses);
  
        const currentResponse = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/GetCurrentFormationsCount`, { withCredentials: true });
        setCurrentFormation(currentResponse.data.currentFormations);
  
        const currentFormations = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/GetCurrentFormations`, { withCredentials: true });
        setCurrent(currentFormations.data.currentFormations);

        const upcomingformation = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/UpcomingFormations`, { withCredentials: true });
        setUpComing(upcomingformation.data.upcomingFormation);

        const chartData = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/Confirmationrate`, { withCredentials: true });
        setData(chartData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("confirmationPieChart").getContext("2d");

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Confirmed Candidates", "Number of Candidates"],
        datasets: [
          {
            data: [
              data.confirmedCandidates,
              data.totalCandidates - data.confirmedCandidates,
            ],
            backgroundColor: ["#10B981", "#F59E0B"],
            hoverBackgroundColor: ["#059669", "#D97706"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                return `${label}: ${value}`;
              }
            }
          },
        },
      },
      plugins: [
        {
          id: 'centerText',
          beforeDraw: function (chart) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            ctx.restore();
            
            // Calculate font sizes based on chart dimensions
            const percentageFontSize = Math.min(width, height) / 9;
            const labelFontSize = Math.min(width, height) / 16;
            
            // Percentage text
            ctx.font = `bold ${percentageFontSize}px sans-serif`;
            ctx.textBaseline = "center";
            ctx.textAlign = "center";

            const text = `${data.confirmationRate}%`;
            const textX = width / 2;
            const textY = height / 2.4 - labelFontSize / 2;

            ctx.fillStyle = "#374151";
            ctx.fillText(text, textX, textY);
            
            ctx.save();
          },
        },
      ],
    });

    return () => {
      chart.destroy();
    };
  }, [data]);


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
        <div className="p-8 shadow-lg rounded-xl bg-gradient-to-r from-[#FABC3F] to-yellow-500 text-white flex items-center transform hover:scale-105 transition-transform duration-300">
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
        <div className="space-y-6 ">

          {/* Current Events */}
          <Card className="overflow-hidden shadow-xl rounded-lg">
            <CardHeader className="bg-gradient-to-br from-red-400 to-orange-500 text-white py-4">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2" /> Current Events
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto bg-white">
              {current && current.length > 0 ? (
                current.map((course) => (
                  <div key={course._id} className="py-4 flex items-start space-x-4">
                    <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: <span className="font-medium text-orange-700">{course.type}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {course.mentors.map((mentor) => `${mentor.firstName} ${mentor.lastName}` )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No current events found.</p>
              )}
            </CardContent>
          </Card>

            
          {/* Upcoming Events */}
          <Card className="overflow-hidden shadow-xl rounded-lg">
            <CardHeader className="bg-gradient-to-br from-green-500 to-green-700 text-white py-4">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2" /> Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto bg-white">
              {upcoming && upcoming.length > 0 ? (
                upcoming.map((course) => (
                  <div key={course._id} className="py-4 flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-700" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: <span className="font-medium text-green-700">{course.type}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {course.mentors.map((mentor) => `${mentor.firstName} ${mentor.lastName}` )}
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

        {/* Chart */}
        <div className="rounded-lg flex items-center justify-center">
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="text-2xl font-bold">Candidate Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80 w-full">
                <canvas id="confirmationPieChart" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-green-800 font-semibold">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{data.confirmedCandidates}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <p className="text-yellow-800 font-semibold">Total candidates</p>
                  <p className="text-2xl font-bold text-yellow-600">{data.totalCandidates - data.confirmedCandidates}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>



    </div>
  );
};

export default Dashboard;
