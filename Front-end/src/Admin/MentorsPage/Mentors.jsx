import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, ChevronDown, ChevronUp, UserPlus, Mail, Phone, Briefcase } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Mentors() {
  const [mentorsData, setMentorsData] = useState([])
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/allmentors`, { 
          withCredentials: true 
        })
        setMentorsData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleMentorClick = (mentorId) => {
    setSelectedMentor(selectedMentor === mentorId ? null : mentorId)
  }

  const handleAddMentor = () => {
    console.log("Add mentor button clicked")
  }

  const filteredMentors = mentorsData.filter(mentor => 
    `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gradient-to-br from-grey-100 to-grey-200 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mentors List - Left Side */}
        <div className="lg:col-span-7">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-2xl font-bold text-purple-800 flex items-center">
                <Users className="mr-2 h-6 w-6" /> Our Mentors
              </CardTitle>
              <Button
                onClick={handleAddMentor}
                className="bg-green-500 hover:bg-green-600 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Mentor
              </Button>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-4">
                  {filteredMentors.map((mentor) => (
                    <Card 
                      key={mentor._id} 
                      className={`overflow-hidden bg-white shadow-md rounded-lg transition-all duration-300 hover:shadow-lg
                        ${selectedMentor === mentor._id ? 'ring-2 ring-purple-500' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16 border-2 border-purple-200">
                            <AvatarImage 
                              src={mentor.profilePic} 
                              alt={`${mentor.firstName} ${mentor.lastName}`} 
                            />
                            <AvatarFallback className="bg-purple-200 text-purple-800">
                              {mentor.firstName[0]}{mentor.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-purple-800">
                              {mentor.firstName} {mentor.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">{mentor.email}</p>
                          </div>
                          <Button
                            onClick={() => handleMentorClick(mentor._id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                          >
                            {selectedMentor === mentor._id ? 'Hide Details' : 'View Details'}
                            {selectedMentor === mentor._id ? (
                              <ChevronUp className="h-4 w-4 ml-2" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-2" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Mentor Details - Right Side */}
        <div className="lg:col-span-5">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 sticky top-4 overflow-hidden shadow-xl">
            <CardHeader className="bg-purple-50 pb-2">
              <CardTitle className="text-2xl font-bold text-purple-800">Mentor Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {selectedMentor ? (
                (() => {
                  const mentor = mentorsData.find(m => m._id === selectedMentor)
                  return (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-24 h-24 border-4 border-purple-200">
                          <AvatarImage 
                            src={mentor.profilePic} 
                            alt={`${mentor.firstName} ${mentor.lastName}`} 
                          />
                          <AvatarFallback className="text-2xl bg-purple-200 text-purple-800">
                            {mentor.firstName[0]}{mentor.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold text-purple-800">{mentor.firstName} {mentor.lastName}</h2>
                          <p className="text-sm text-gray-500">Mentor ID: {mentor._id}</p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-purple-500" />
                          <p className="text-gray-700">{mentor.email}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-purple-500" />
                          <p className="text-gray-700">{mentor.phoneNumber}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Briefcase className="h-5 w-5 text-purple-500" />
                          <p className="text-gray-700">{mentor.courseCount} Courses</p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">Additional Information</h3>
                        <p className="text-gray-600">
                          {mentor.bio || "No additional information available."}
                        </p>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a mentor to view their details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}