import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const Homepage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormations`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const currentDate = new Date();
  const currentCourses = courses.filter(
    (course) =>
      new Date(course.startDate) <= currentDate &&
      new Date(course.endDate) >= currentDate
  );
  const upcomingCourses = courses.filter(
    (course) => new Date(course.startDate) > currentDate
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <Button
              className="w-full text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              size="lg"
            >
              WorkFlow
            </Button>
          </div>
          <div className="w-full md:w-3/4 space-y-8">
            {/* Current Courses Section */}
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-2xl">Current Events</CardTitle>
              </CardHeader>
              <CardContent className="divide-y max-h-80 overflow-y-auto">
                {currentCourses.map((course) => (
                  <div key={course._id} className="py-4 flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      <p className="text-sm text-gray-600">
                        {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-500">{course.description}</p>
                      <p className="text-sm text-gray-500">Type: {course.type}</p>
                      <p className="text-sm text-gray-500">
                        Mentors: {course.mentors.map((mentor) => mentor.email).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Upcoming Courses Section */}
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                <CardTitle className="text-2xl">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="divide-y max-h-80 overflow-y-auto">
                {upcomingCourses.map((course) => (
                  <div
                    key={course._id}
                    className="py-4 flex items-center justify-between group hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p className="text-sm text-gray-600">
                          {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                        </p>
                        <p className="text-sm text-gray-500">{course.description}</p>
                        <p className="text-sm text-gray-500">Type: {course.type}</p>
                        <p className="text-sm text-gray-500">
                          Mentors: {course.mentors.map((mentor) => mentor.email).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-amber-500">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-sm font-medium">Upcoming</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;