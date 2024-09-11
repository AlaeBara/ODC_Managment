import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar, Clock, AlertTriangle, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

export default function Homepage() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormations`,
          {
            credentials: "include",
          }
        )
        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }
        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      }
    }

    fetchCourses()
  }, [])

  const currentDate = new Date()
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const currentCourses = filteredCourses.filter(
    (course) =>
      new Date(course.startDate) <= currentDate &&
      new Date(course.endDate) >= currentDate
  )
  const upcomingCourses = filteredCourses.filter(
    (course) => new Date(course.startDate) > currentDate
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 space-y-4">
            <Button
              className="w-full text-lg font-semibold bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-600 hover:to-orange-600 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              size="lg"
            >
              WorkFlow
            </Button>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="w-full md:w-3/4 space-y-8">
            {/* Current Courses Section */}
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3">
                <CardTitle className="text-2xl">Current Events</CardTitle>
              </CardHeader>
              <CardContent className="divide-y max-h-[275px] overflow-y-auto">
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
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
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">No current events found.</p>
                )}
              </CardContent>
            </Card>
            {/* Upcoming Courses Section */}
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3">
                <CardTitle className="text-2xl">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="divide-y max-h-[275px] overflow-y-auto">
                {upcomingCourses.length > 0 ? (
                  upcomingCourses.map((course) => (
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
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">No upcoming events found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}