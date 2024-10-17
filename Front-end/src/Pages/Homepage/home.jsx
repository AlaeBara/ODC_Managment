import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle, Search, CheckCircle2, Users, BookOpen, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const WorkflowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
  </svg>
)

export default function Homepage() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userName, setUserName] = useState("....")
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalFormations, setTotalFormations] = useState(0)
  const [totalPresentStudents, setTotalPresentStudents] = useState(0)
  const [confirmationRate, setConfirmationRate] = useState(0)
  const [confirmedCandidates, setConfirmedCandidates] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`,
          { credentials: "include" }
        )
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses")
        const coursesData = await coursesResponse.json()
        setCourses(coursesData)

        const userResponse = await fetch(`${import.meta.env.VITE_API_LINK}/api/home/gethomepageinfo`, {
          credentials: "include",
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserName(userData.firstName)
          setTotalStudents(userData.totalStudents)
          setTotalPresentStudents(userData.totalPresentstudents)
          setTotalFormations(userData.totalFormations)
          // Assuming these fields are available in the API response
          setConfirmationRate(userData.confirmationRate || 0)
          setConfirmedCandidates(userData.confirmedCandidates || 0)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const currentDate = new Date()
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const currentCourses = filteredCourses.filter(
    (course) => new Date(course.startDate) <= currentDate && new Date(course.endDate) >= currentDate
  )
  const upcomingCourses = filteredCourses.filter((course) => new Date(course.startDate) > currentDate)

  const chartData = {
    labels: ['Confirmed Candidates', 'Unconfirmed Candidates'],
    datasets: [
      {
        data: [confirmedCandidates, totalStudents - confirmedCandidates],
        backgroundColor: ['#f97316', '#e2e8f0'],
        hoverBackgroundColor: ['#ea580c', '#cbd5e1'],
      },
    ],
  }

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {userName} <span className="wave">👋</span>
          </h1>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 border-orange-300 focus:border-orange-500 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-full text-gray-800 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <BookOpen className="w-10 h-10 text-orange-500" />
                <h2 className="text-3xl font-bold text-orange-500">{totalFormations}</h2>
              </div>
              <p className="mt-2 text-lg font-semibold">Total Formations</p>
            </div>
          </Card>

          <Card className="bg-white shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <Users className="w-10 h-10 text-orange-500" />
                <h2 className="text-3xl font-bold text-orange-500">{totalStudents}</h2>
              </div>
              <p className="mt-2 text-lg font-semibold">Total Students</p>
            </div>
          </Card>

          <Card className="bg-white shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <User className="w-10 h-10 text-orange-500" />
                <h2 className="text-3xl font-bold text-orange-500">{totalPresentStudents}</h2>
              </div>
              <p className="mt-2 text-lg font-semibold">Present Students</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden shadow-xl rounded-lg">
              <CardHeader className="bg-gradient-to-br from-gray-800 to-black text-white py-4">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Calendar className="mr-2" /> Current Events
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto bg-white">
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
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
                  <Clock className="mr-2" /> Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto bg-white">
                {upcomingCourses.length > 0 ? (
                  upcomingCourses.map((course) => (
                    <div key={course._id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Type: <span className="font-medium text-orange-700">{course.type}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full shadow-md">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-bold text-center">Coming Soon</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500">No upcoming events found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Link to="/workflow">
              <Button
                className="w-full text-lg font-semibold bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-orange-400"
                size="lg"
              >
                <WorkflowIcon />
                <span className="ml-2">WorkFlow</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}