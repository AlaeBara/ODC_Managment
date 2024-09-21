import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, ChevronUp, Share2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function CourseEvaluations() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`, {
          credentials: 'include'
        })
        if (!response.ok) throw new Error("Failed to fetch courses")
        const data = await response.json()
        setCourses(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const toggleExpand = (courseId) => {
    setExpandedCourse(prev => (prev === courseId ? null : courseId))
  }

  const generateEvaluationLink = async (courseId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/GenerateEvaluationLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error("Failed to generate evaluation link")
      const { evaluationLink } = await response.json()
      navigator.clipboard.writeText(evaluationLink)
      toast.success('Evaluation link generated and copied to clipboard')
      toast.info(`Evaluation link: ${evaluationLink}`)
    } catch (error) {
      console.error("Error generating evaluation link:", error)
      toast.error('Failed to generate evaluation link. Please try again.')
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Course Evaluations</h1>
        <div className="relative w-full max-w-md mb-8">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full shadow-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold truncate">{course.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(course._id)}
                    className="text-white hover:bg-white/20"
                  >
                    {expandedCourse === course._id ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                  </p>
                </div>
                <p className="text-sm text-gray-700 mb-2">{course.description}</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {course.type}
                </Badge>
              </CardContent>
              {expandedCourse === course._id && (
                <CardFooter className="bg-gray-50 p-4">
                  <Button 
                    onClick={() => generateEvaluationLink(course._id)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Generate Evaluation Link</span>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
        {filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  )
}