import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Users, ChevronDown, ChevronUp, UserPlus, Mail, Phone, Briefcase, Search, ChevronRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Component() {
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mentors List - Left Side */}
          <div className="lg:col-span-7">
            <Card className="bg-white shadow-xl max-h-[600px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-bold text-orange-500 flex items-center">
                  <Users className="mr-2 h-6 w-6" /> Mentors List
                </CardTitle>
                <Button
                  onClick={handleAddMentor}
                  className="bg-green-400 hover:bg-green-500 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Mentor
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
                  <Input
                    placeholder="Search mentors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-500 w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                </div>
                <ScrollArea className={`h-[${Math.min(filteredMentors.length * 100, 400)}px]`}>
                  <div className="space-y-4">
                    {filteredMentors.map((mentor) => (
                      <Card 
                        key={mentor._id} 
                        className={`overflow-hidden bg-white shadow-md rounded-lg transition-all duration-300 hover:shadow-lg
                          ${selectedMentor === mentor._id ? 'bg-orange-20' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16 border-2 border-orange-200">
                              <AvatarImage 
                                src={mentor.profilePic} 
                                alt={`${mentor.firstName} ${mentor.lastName}`} 
                              />
                              <AvatarFallback className="bg-orange-200 text-orange-800">
                                {mentor.firstName[0]}{mentor.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                              <h3 className="text-lg font-semibold text-orange-800">
                                {mentor.firstName} {mentor.lastName}
                              </h3>
                              <p className="text-sm text-gray-500">{mentor.email}</p>
                            </div>
                            <Button
                              onClick={() => handleMentorClick(mentor._id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
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
            <Card className="bg-white sticky top-4 overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-br from-orange-400 to-orange-500 text-white">
                <CardTitle className="text-2xl font-bold">Mentor Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedMentor ? (
                  (() => {
                    const mentor = mentorsData.find(m => m._id === selectedMentor)
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-24 h-24 border-4 border-orange-200">
                            <AvatarImage 
                              src={mentor.profilePic} 
                              alt={`${mentor.firstName} ${mentor.lastName}`} 
                            />
                            <AvatarFallback className="text-2xl bg-orange-200 text-orange-800">
                              {mentor.firstName[0]}{mentor.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-2xl font-bold text-orange-800">{mentor.firstName} {mentor.lastName}</h2>
                            <p className="text-sm text-gray-500">Mentor ID: {mentor._id}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-orange-500" />
                            <p className="text-gray-700">{mentor.email}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-orange-500" />
                            <p className="text-gray-700">{mentor.phoneNumber}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Briefcase className="h-5 w-5 text-orange-500" />
                            <p className="text-gray-700">{mentor.courseCount} Courses</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div>
                          <h3 className="text-lg font-semibold text-orange-800 mb-2">Additional Information</h3>
                          <p className="text-gray-600">
                            {mentor.bio || "No additional information available."}
                          </p>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <div className="text-center p-8">
                    <Users className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a mentor to view their details</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 border-t flex justify-end p-3 gap-2">
                <Button className="bg-red-500 text-white hover:bg-red-600 rounded-full px-4 py-1 text-sm">
                  Delete mentor
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}