import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, ChevronUp, Upload, Phone, UserCheck, Search, Users, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Workflow() {
  const [formations, setFormations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFormations, setExpandedFormations] = useState([])

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormations`,
          {
            credentials: "include",
          }
        )
        if (!response.ok) {
          throw new Error("Failed to fetch formations")
        }
        const data = await response.json()
        setFormations(data)
      } catch (error) {
        console.error("Error fetching formations:", error)
      }
    }

    fetchFormations()
  }, [])

  const filteredFormations = formations.filter(formation =>
    formation.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleExpand = (formationId) => {
    setExpandedFormations(prev =>
      prev.includes(formationId)
        ? prev.filter(id => id !== formationId)
        : [...prev, formationId]
    )
  }

  const importCandidates = (formationId) => {
    console.log(`Importing candidates for formation ${formationId}`)
    // Implement the import functionality here
  }

  const validateCandidates = (formationId) => {
    console.log(`Validating candidates for formation ${formationId}`)
    // Implement the validation functionality here
  }

  const checkPresence = (formationId) => {
    console.log(`Checking presence for formation ${formationId}`)
    // Implement the presence checking functionality here
  }

  const getImportanceLevel = (formation) => {
    const endDate = new Date(formation.endDate)
    const today = new Date()
    const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))

    if (daysUntilEnd <= 3 && !formation.workflowCompleted) {
      return { color: 'red', text: 'Urgent', description: 'Ending soon, workflow incomplete' }
    } else if (daysUntilEnd <= 7 && !formation.workflowCompleted) {
      return { color: 'orange', text: 'Important', description: 'Approaching deadline, workflow incomplete' }
    } else {
      return { color: 'green', text: 'On Track', description: 'Formation on schedule' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Formations</h1>
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search formations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFormations.map((formation) => {
            const importance = getImportanceLevel(formation)
            return (
              <Card key={formation._id} className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold truncate">{formation.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(formation._id)}
                      className="text-white hover:bg-orange-600"
                    >
                      {expandedFormations.includes(formation._id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <p className="text-sm text-gray-600">
                        {`${new Date(formation.startDate).toLocaleDateString()} - ${new Date(formation.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`bg-${importance.color}-100 text-${importance.color}-800 border-${importance.color}-300`}
                    >
                      {importance.text}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{formation.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {formation.type}
                    </Badge>
                    <p className="text-xs text-gray-500 italic">{importance.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">
                      Mentors: {formation.mentors.map((mentor) => mentor.email).join(", ")}
                    </p>
                  </div>
                </CardContent>
                {expandedFormations.includes(formation._id) && (
                  <CardFooter className="bg-gray-50 p-4">
                    <div className="w-full space-y-2">
                      <Button size="sm" className="w-full flex items-center justify-center space-x-2" onClick={() => importCandidates(formation._id)}>
                        <Upload className="w-4 h-4" />
                        <span>Import Candidates</span>
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