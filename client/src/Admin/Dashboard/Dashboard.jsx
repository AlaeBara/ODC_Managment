import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Clipboard, BarChart2, CheckCircle2, Calendar, PieChart, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
  const [mentorsData, setMentorsData] = useState([]);

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

        const mentorsData = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/allmentors`, { withCredentials: true });
        setMentorsData(mentorsData.data)

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
            backgroundColor: ["#f97316", "#c9ccd1"],
            hoverBackgroundColor: ["#f97316", "#c9ccd1"],
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
            display: false,
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
            
            const percentageFontSize = Math.min(width, height) / 6;
            const labelFontSize = Math.min(width, height) / 14;
            
            ctx.font = `bold ${percentageFontSize}px sans-serif`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            const text = `${data.confirmationRate}%`;
            const textX = width / 2;
            const textY = height / 2;

            ctx.fillStyle = "#000000";
            ctx.fillText(text, textX, textY);
            
            ctx.font = `${labelFontSize}px sans-serif`;
            ctx.fillText("Confirmation Rate", textX, textY + percentageFontSize / 2 + 10);
            
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
    <div className="grid mt-4  gap-6 px-4 sm:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-9 p-6 rounded-lg">
        {/* Card 1 */}
        <Card className="bg-white shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 relative">
          <div className="p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400 opacity-20 rounded-full -mr-10 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400 opacity-20 rounded-full -ml-5 -mb-12" />
            <div className="flex items-center justify-between">
              <Clipboard className="w-10 h-10 " />
              <h2 className="text-3xl font-bold text-orange-500">{currentFormation}</h2>
            </div>
            <p className="mt-2 text-lg font-semibold">Current Formations</p>
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="bg-white shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 relative">
          <div className="p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400 opacity-20 rounded-full -mr-10 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400 opacity-20 rounded-full -ml-5 -mb-12" />
            <div className="flex items-center justify-between">
              <Users className="w-10 h-10 " />
              <h2 className="text-3xl font-bold text-orange-500">{totalMentors}</h2>
            </div>
            <p className="mt-2 text-lg font-semibold">Total Mentors</p>
          </div>
        </Card>

        {/* Card 3 */}
        <Card className="bg-white shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 relative">
          <div className="p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400 opacity-20 rounded-full -mr-10 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400 opacity-20 rounded-full -ml-5 -mb-12" />
            <div className="flex items-center justify-between">
              <BarChart2 className="w-10 h-10 " />
              <h2 className="text-3xl font-bold text-orange-500">{numberOfFormation}</h2>
            </div>
            <p className="mt-2 text-lg font-semibold">Number of Formations</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Current Events Card */}
          <Card className="bg-white shadow-xl rounded-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2 font-semibold" /> Current Events
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-200 max-h-[250px] overflow-y-auto">
              {current && current.length > 0 ? (
                current.map((course) => (
                  <div key={course._id} className="py-4 flex items-start space-x-4">
                    <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-gray-800 font-lato">{course.title}</h3>
                      <p className="text-sm text-gray-600 font-opensans">
                        {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: <span className="font-medium text-orange-500">{course.type}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block bg-orange-100 text-orange-500 text-xs font-semibold px-2 py-1 rounded-full">
                        {course.mentors.map((mentor) => `${mentor.firstName} ${mentor.lastName}`)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No current events found.</p>
              )}
            </CardContent>
          </Card>
            
          {/* Upcoming Events Card */}
          <Card className="bg-white shadow-xl rounded-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2 font-semibold" /> Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-200 max-h-[250px] overflow-y-auto">
              {upcoming && upcoming.length > 0 ? (
                upcoming.map((course) => (
                  <div key={course._id} className="py-4 flex items-start space-x-4">
                    <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-gray-800 font-lato">{course.title}</h3>
                      <p className="text-sm text-gray-600 font-opensans">
                        {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: <span className="font-medium text-orange-500">{course.type}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block bg-orange-100 text-orange-500 text-xs font-semibold px-2 py-1 rounded-full">
                        {course.mentors.map((mentor) => `${mentor.firstName} ${mentor.lastName}`)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No upcoming events found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Chart Card */}
        <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-2xl font-bold flex items-center">
              <PieChart className="mr-2" /> Candidate Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full">
              <canvas id="confirmationPieChart" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="font-semibold text-center">Confirmed</p>
                <p className="text-2xl font-bold text-orange-500 text-center">{data.confirmedCandidates}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="font-semibold text-center">Total</p>
                <p className="text-2xl font-bold text-orange-500 text-center">{data.totalCandidates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;