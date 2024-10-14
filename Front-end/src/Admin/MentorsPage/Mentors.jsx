import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Users, ChevronDown, ChevronUp, UserPlus, Mail, Phone, Briefcase, Search, AlertTriangle ,X, Copy} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Component() {
  const [mentorsData, setMentorsData] = useState([])
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [mentorToDelete, setMentorToDelete] = useState(null)

  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false)
  const [newMentor, setNewMentor] = useState({ firstName: '', lastName: '', email: '' })
  const [generatedPassword, setGeneratedPassword] = useState('')


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

  useEffect(() => {
    fetchData()
  }, [])

  const handleMentorClick = (mentorId) => {
    setSelectedMentor(selectedMentor === mentorId ? null : mentorId)
  }

  const handleEditMentor = (mentorId) => {
    console.log(`Edited mentor (${mentorId})`)
  }

  const handleDeleteClick = (mentor) => {
    setMentorToDelete(mentor)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (mentorToDelete) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_LINK}/api/admin/mentors/${mentorToDelete._id}`, { 
          withCredentials: true 
        });
    
        if (response.status === 200) {
          console.log('Mentor deleted successfully');
          setMentorsData(prevData => prevData.filter(mentor => mentor._id !== mentorToDelete._id));
          setSelectedMentor(null);
        }
      } catch (error) {
        console.error('Error deleting mentor:', error);
      }
    }
    setIsDeleteModalOpen(false)
    setMentorToDelete(null)
  }

  const filteredMentors = mentorsData.filter(mentor => 
    `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )


  //for add mentor 

  
  const handleAddMentor = () => {
    setIsAddMentorModalOpen(true)
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setGeneratedPassword(password)
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
  }

  const closeAddMentor = () => {
    setIsAddMentorModalOpen(false)
    setNewMentor({ firstName: '', lastName: '', email: '' })
    setGeneratedPassword('')
  }


  const handleSubmitNewMentor = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_LINK}/api/admin/addmentor`, {
        ...newMentor,
        password: generatedPassword
      }, { withCredentials: true })
      if (response.status === 200) {
        console.log('Mentor added successfully')
        setIsAddMentorModalOpen(false)
        fetchData()
        setNewMentor({ firstName: '', lastName: '', email: '' })
        setGeneratedPassword('')
      }
    } catch (error) {
      console.error('Error adding mentor:', error)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mentors List - Left Side */}
          <div className="lg:col-span-7">
            <Card className="bg-white shadow-xl overflow-hidden" style={{ minHeight: `${Math.min(filteredMentors.length * 100, 600)}px` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-bold text-orange-500 flex items-center">
                  <Users className="mr-2 h-6 w-6" /> Mentors List
                </CardTitle>
                <Button
                  onClick={handleAddMentor}
                  className="bg-green-500 hover:bg-green-700 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
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
                <ScrollArea className="h-[calc(100%-80px)]">
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
              {selectedMentor && (
                <CardFooter className="bg-gray-50 border-t flex justify-end p-3 gap-2">
                  <Button 
                    className="bg-red-500 text-white hover:bg-red-600 rounded-full px-4 py-1 text-sm"
                    onClick={() => handleDeleteClick(mentorsData.find(m => m._id === selectedMentor))}
                  >
                    Delete Mentor
                  </Button>
                  <Button 
                  onClick={() => handleEditMentor(selectedMentor)}
                  className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-4 py-1 text-sm">
                    Edit Mentor
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[500px] w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Delete Mentor
            </DialogTitle>
            <DialogDescription>
              You are going to delete {mentorToDelete ? `${mentorToDelete.firstName} ${mentorToDelete.lastName}` : 'this mentor'}. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              No, Keep It
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Yes, Delete!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Add Mentor Modal */}
      <Dialog open={isAddMentorModalOpen} onOpenChange={closeAddMentor}>
        <DialogContent className="sm:max-w-[500px] w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between mb-5">
              <span>Add New Mentor</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitNewMentor}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="First Name"
                value={newMentor.firstName}
                onChange={(e) => setNewMentor({...newMentor, firstName: e.target.value})}
                className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                required
              />
              <Input
                placeholder="Last Name"
                value={newMentor.lastName}
                onChange={(e) => setNewMentor({...newMentor, lastName: e.target.value})}
                className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                required
              />
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={newMentor.email}
              onChange={(e) => setNewMentor({...newMentor, email: e.target.value})}
              className="mb-4 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              required
            />
            <div className="flex items-center space-x-2 mb-4">
              <Input
                type="text"
                value={generatedPassword}
                placeholder="Generated Password"
                readOnly
                className="flex-grow ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              />
              <Button type="button" onClick={generatePassword}>
                Generate
              </Button>
              <Button type="button" onClick={copyPassword} disabled={!generatedPassword}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={!newMentor.firstName || !newMentor.lastName || !newMentor.email || !generatedPassword}>
                Add Mentor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>










    </div>
  )
}