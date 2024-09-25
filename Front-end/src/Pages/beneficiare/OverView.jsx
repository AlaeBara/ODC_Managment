"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Search, ArrowUpRight, Users, UserRoundCheck, Clock } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from "framer-motion"

export default function OverView() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentCounts, setStudentCounts] = useState({})
  const [presenceCounts, setPresenceCounts] = useState({})

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
        return "bg-blue-100 text-blue-800"
      case "Ongoing":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const status = getStatus(course)
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(course)
    return acc
  }, {})

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  )
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-orange-600 mb-8 text-center">Course Overview</h1>
        <div className="relative w-full max-w-md mx-auto mb-12">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full rounded-full shadow-lg ring-2 ring-orange-300 focus:ring-orange-500 transition-all duration-300"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={24} />
        </div>
        {['Not Started', 'Ongoing', 'Completed'].map(status => (
          groupedCourses[status] && groupedCourses[status].length > 0 && (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{status} Formations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedCourses[status].map((course) => (
                  <motion.div
                    key={course._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl transform hover:-translate-y-2">
                      <CardHeader className="p-6 bg-orange-500">
                        <CardTitle className="text-xl font-bold truncate text-white">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
                            {status}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-5 h-5 text-orange-500" />
                              <span className="text-sm text-gray-600">Start Date</span>
                            </div>
                            <span className="text-sm font-medium">{new Date(course.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-5 h-5 text-orange-500" />
                              <span className="text-sm text-gray-600">End Date</span>
                            </div>
                            <span className="text-sm font-medium">{new Date(course.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <UserRoundCheck className="w-5 h-5 text-orange-500" />
                              <span className="text-sm text-gray-600">Confirmed</span>
                            </div>
                            <span className="text-sm font-medium">{studentCounts[course._id] || 0}</span>
                          </div>
                          {status === "Completed" && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-orange-500" />
                                <span className="text-sm text-gray-600">Attendance</span>
                              </div>
                              <span className="text-sm font-medium">{presenceCounts[course._id] || 0}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-orange-50 p-6">
                        <Button 
                          onClick={() => console.log("View details for", course.title)}
                          className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200 rounded-full py-2"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          <span>View Details</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        ))}
        {filteredCourses.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-64 text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="w-16 h-16 text-orange-300 mb-4" />
            <p className="text-xl font-medium text-orange-600">No courses found.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}