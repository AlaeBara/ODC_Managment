import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, ChevronUp, Upload, Phone, UserCheck, Search } from "lucide-react"

export default function FormationsPage() {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Formations</h1>
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
        <div className="space-y-6">
          {filteredFormations.map((formation) => (
            <Card key={formation._id} className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">{formation.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(formation._id)}
                    className="text-white hover:bg-orange-600"
                  >
                    {expandedFormations.includes(formation._id) ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="divide-y">
                <div className="py-4 flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {`${new Date(formation.startDate).toLocaleDateString()} - ${new Date(formation.endDate).toLocaleDateString()}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{formation.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Type: {formation.type}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Mentors: {formation.mentors.map((mentor) => mentor.email).join(", ")}
                    </p>
                  </div>
                </div>
                {expandedFormations.includes(formation._id) && (
                  <div className="py-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span>Import Candidate List</span>
                      <Button size="sm" onClick={() => importCandidates(formation._id)}>Import</Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span>Validate Candidates</span>
                      <Button size="sm" onClick={() => validateCandidates(formation._id)}>Start Validation</Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-5 h-5 text-gray-500" />
                      <span>Check Presence</span>
                      <Button size="sm" onClick={() => checkPresence(formation._id)}>Mark Attendance</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}