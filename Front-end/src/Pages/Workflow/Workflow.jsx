'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios' // Import axios
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, ChevronUp, Upload, Phone, UserCheck, Search, Users, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function Component() {
  const [formations, setFormations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFormation, setExpandedFormation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null) // File state

  useEffect(() => {
    const fetchFormations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`,
          {
            credentials: "include",
          }
        )
        if (!response.ok) {
          throw new Error("Failed to fetch formations")
        }
        const data = await response.json()
        setFormations(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching formations:", error)
        setError("Failed to load formations. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormations()
  }, [])

  const toggleExpand = (formationId) => {
    setExpandedFormation(prev => (prev === formationId ? null : formationId))
  }
  
  const getImportanceLevel = (formation) => {
    const startDate = new Date(formation.startDate)
    const endDate = new Date(formation.endDate)
    const today = new Date()
    const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
    const hasStarted = today >= startDate
  
    if (daysUntilEnd === 1) {
      return { priority: 1, color: 'red', text: 'Urgent', description: '1 day left', progress: 90 }
    } else if (hasStarted) {
      return { priority: 2, color: 'yellow', text: 'Important', description: 'Happening now', progress: 50 }
    } else if (!hasStarted) {
      return { priority: 3, color: 'green', text: 'Upcoming', description: 'Not started yet', progress: 10 }
    }
    return { priority: 3, color: 'green', text: 'Upcoming', description: 'Upcoming', progress: 10 }
  }
  
  const filteredFormations = formations
    .filter(formation =>
      formation.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const importanceA = getImportanceLevel(a).priority
      const importanceB = getImportanceLevel(b).priority
      return importanceA - importanceB
    })

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post(`${import.meta.env.VITE_API_LINK}/api/upload-excel`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      alert('File uploaded successfully')
    } catch (err) {
      console.error('Error uploading file', err)
      alert('File upload failed')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading formations...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-sans font-bold text-gray-800 mb-8">Formations Workflow</h1>
        <div className="relative w-full max-w-md mb-8">
          <Input
            type="text"
            placeholder="Search formations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormations.map((formation) => {
            const importance = getImportanceLevel(formation)
            return (
              <Card key={formation._id} className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader className={`text-white bg-gradient-to-r from-orange-500 to-orange-600 py-2`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold truncate">{formation.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(formation._id)}
                      className="text-white"
                      aria-label={expandedFormation === formation._id ? "Collapse formation details" : "Expand formation details"}
                    >
                      {expandedFormation === formation._id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant="outline" 
                      className={`${
                        importance.color === 'yellow' 
                          ? 'bg-yellow-400 text-white border-yellow-400' 
                          : `bg-${importance.color}-500 text-white border-${importance.color}-600`
                      } px-3 py-1 text-sm font-semibold`}
                    >
                      {importance.text}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 text-black-600`} />
                      <span className={`text-sm font-medium text-black-600`}>
                        {importance.description}
                      </span>
                    </div>
                  </div>
                  <Progress value={importance.progress} className="mb-4" />
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      {`${new Date(formation.startDate).toLocaleDateString()} - ${new Date(formation.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{formation.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className={`bg-transparent text-black hover:bg-gray-200 hover:text-gray-600 transition-colors duration-200`}>
                      {formation.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">
                      Mentors: {formation.mentors.map((mentor) => mentor.email).join(", ")}
                    </p>
                  </div>
                </CardContent>
                {expandedFormation === formation._id && (
                  <CardFooter className="bg-gray-50 p-4">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Import Candidates</span>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                      </div>
                      <Button size="sm" className="w-full flex items-center justify-center space-x-2" onClick={handleUpload}>
                        Upload
                      </Button>
                      <Button size="sm" className="w-full flex items-center justify-center space-x-2" onClick={() => validateCandidates(formation._id)}>
                        <Phone className="w-4 h-4" />
                        <span>Validate Candidates</span>
                      </Button>
                      <Button size="sm" className="w-full flex items-center justify-center space-x-2" onClick={() => checkPresence(formation._id)}>
                        <UserCheck className="w-4 h-4" />
                        <span>Check Presence</span>
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}