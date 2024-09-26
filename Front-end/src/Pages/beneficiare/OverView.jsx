'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Search, ArrowUpRight, Users, UserRoundCheck, Clock, BookOpen } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from "framer-motion"

export default function CourseOverviewTimeline() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentCounts, setStudentCounts] = useState({})
  const [presenceCounts, setPresenceCounts] = useState({})
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [coursesResponse, studentCountsResponse, presenceCountsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`, {
            credentials: 'include'
          }),
          fetch(`${import.meta.env.VITE_API_LINK}/api/binificary/NumberOfCandidatesConfirmer`, {
            credentials: 'include'
          }),
          fetch(`${import.meta.env.VITE_API_LINK}/api/binificary/NumberOfCandidatesPresence`, {
            credentials: 'include'
          })
        ])

        if (!coursesResponse.ok) throw new Error("Failed to fetch courses")
        if (!studentCountsResponse.ok) throw new Error("Failed to fetch confirmed candidates")
        if (!presenceCountsResponse.ok) throw new Error("Failed to fetch candidate presence counts")

        const coursesData = await coursesResponse.json()
        const studentCountsData = await studentCountsResponse.json()
        const presenceCountsData = await presenceCountsResponse.json()

        setCourses(coursesData)
        setStudentCounts(studentCountsData.reduce((acc, curr) => {
          acc[curr._id] = curr.numberOfCandidates
          return acc
        }, {}))
        setPresenceCounts(presenceCountsData.reduce((acc, curr) => {
          acc[curr.id_Formation] = curr.numberOfCandidates
          return acc
        }, {}))

        setError(null)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatus = (course) => {
    const now = new Date()
    const startDate = new Date(course.startDate)
    const endDate = new Date(course.endDate)
    
    if (startDate > now) {
      return "Not Started"
    } else if (endDate > now) {
      return "Ongoing"
    } else {
      return "Completed"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "bg-blue-500"
      case "Ongoing":
        return "bg-green-500"
      case "Completed":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeTab === "all" || getStatus(course).toLowerCase() === activeTab)
  )

  const sortedCourses = filteredCourses.sort((a, b) => {
    const statusOrder = { "Ongoing": 0, "Not Started": 1, "Completed": 2 }
    return statusOrder[getStatus(a)] - statusOrder[getStatus(b)]
  })

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  )
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
        >
          Try Again
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-4 sm:p-8 ">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl font-bold text-orange-600 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Courses OverView
        </motion.h1>
        <div className="flex flex-col items-center mb-12 gap-6">
          <motion.div 
            className="relative w-full max-w-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full rounded-full shadow-lg ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 "
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={24} />
          </motion.div>
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-orange-100 rounded-full p-0 pr-1 pl-1 gap-1">
                <TabsTrigger value="all" className="rounded-full px-4 py-2">All</TabsTrigger>
                <TabsTrigger value="ongoing" className="rounded-full px-4 py-2">Ongoing</TabsTrigger>
                <TabsTrigger value="not started" className="rounded-full px-4 py-2">Not Started</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-full px-4 py-2">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {sortedCourses.map((course, index) => {
                const status = getStatus(course)
                return (
                  <motion.li 
                    key={course._id} 
                    className="mb-10 ml-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${getStatusColor(status)}`}>
                      <BookOpen className="w-3 h-3 text-white" />
                    </span>
                    <div className="p-4 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">{course.title}</h3>
                        <span className={`bg-${status === 'Completed' ? 'orange' : status === 'Ongoing' ? 'green' : 'blue'}-100 text-${status === 'Completed' ? 'orange' : status === 'Ongoing' ? 'green' : 'blue'}-800 text-sm font-medium px-2.5 py-0.5 rounded-full`}>
                          {status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-orange-500" />
                          <span className="text-sm text-gray-600">Start: {new Date(course.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <span className="text-sm text-gray-600">End: {new Date(course.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserRoundCheck className="w-5 h-5 text-orange-500" />
                          <span className="text-sm text-gray-600">Confirmed: {studentCounts[course._id] || 0}</span>
                        </div>
                        {status === "Completed" && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-orange-500" />
                            <span className="text-sm text-gray-600">Attendance: {presenceCounts[course._id] || 0}</span>
                          </div>
                        )}
                      </div>
                      {status === "Completed" && (
                        <div className="mt-4">
                          <Button 
                            onClick={() => {
                              console.log("View details for", course.title)
                              toast.info(`Viewing details for ${course.title}`)
                            }}
                            className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 rounded-full py-2 px-4 transform"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            <span>View Details</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.li>
                )
              })}
            </ol>
          </motion.div>
        </AnimatePresence>
        {sortedCourses.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-64 text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="w-16 h-16 text-orange-300 mb-4" />
            <p className="text-xl font-medium text-orange-600">No courses found.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search terms or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}