import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Calendar, User, X ,Clock ,Book} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Formations() {
  const [formations, setFormations] = useState([])
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [mentors, setMentors] = useState([])
  const [selectedMentor, setSelectedMentor] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Mentors`, { withCredentials: true })
        setMentors(response.data)
      } catch (error) {
        console.error('Error fetching mentors:', error)
      }
    }
    fetchMentors()
  }, [])

  useEffect(() => {
    const fetchAllFormations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Filtrage`, { withCredentials: true })
        setFormations(response.data.courses)
      } catch (error) {
        console.error('Error fetching formations:', error)
      }
    }

    if (!search && !startDate && !endDate && !selectedMentor) {
      fetchAllFormations()
    }
  }, [search, startDate, endDate, selectedMentor])

  useEffect(() => {
    const fetchFormationsByMentor = async () => {
      if (selectedMentor) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Filtrage`, {
            params: { mentorId: selectedMentor },
            withCredentials: true,
          })

          if (response.data.courses.length === 0) {
            setMessage('No formations found for this mentor')
            setFormations([])
          } else {
            setMessage('')
            setFormations(response.data.courses)
          }
        } catch (error) {
          setMessage('Error fetching formations for mentor')
          console.error('Error fetching formations:', error)
        }
      }
    }

    fetchFormationsByMentor()
  }, [selectedMentor])

  const fetchFilteredFormations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Filtrage`, {
        params: { search, startDate, endDate, mentorId: selectedMentor },
        withCredentials: true,
      })

      if (response.data.courses.length === 0) {
        setMessage('No formations found for the given criteria')
        setFormations([])
      } else {
        setMessage('')
        setFormations(response.data.courses)
      }
    } catch (error) {
      setMessage('Error fetching formations')
      console.error('Error fetching formations:', error)
    }
  }

  const handleClear = () => {
    setSearch('')
    setStartDate('')
    setEndDate('')
    setSelectedMentor('')
    setMessage('')
  }

  return (
    <div className="min-h-screen mt-4">
        <div className="container mx-auto px-4 py-8">
            <div className="w-full bg-white p-4 rounded-lg shadow-sm mb-8">
                <div className="flex flex-wrap gap-4 items-center">

                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            value={search}
                            placeholder="Search..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 border-orange-300 w-full"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="pl-10 border-orange-300 w-full"
                        />
                    </div>

                    {/* End Date */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="pl-10 border-orange-300 w-full"
                        />
                    </div>

                    {/* Mentor Select */}
                    <div className="flex-1 min-w-[200px]">
                        <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                            <SelectTrigger className="border-orange-300 ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent">
                                        <User className="mr-2 h-4 w-4 text-orange-400" />
                                        <SelectValue placeholder="Select Mentor" />
                            </SelectTrigger>
                            <SelectContent>
                                {mentors.map((mentor) => (
                                <SelectItem key={mentor._id} value={mentor._id}>
                                    {mentor.firstName} {mentor.lastName}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4  ">
                        <Button onClick={fetchFilteredFormations} className="bg-orange-500 hover:bg-orange-600 text-white">
                            Search
                        </Button>
                        <Button onClick={handleClear} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                            Clear
                        </Button>
                    </div>
                </div>
            </div>
            
            
            {message && (
            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative mb-9" role="alert">
                <span className="block sm:inline">{message}</span>
            </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formations.map((formation, index) => (
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white rounded-2xl transform hover:-translate-y-2">
                    <CardHeader className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6">
                    <CardTitle className="text-xl md:text-2xl font-bold">{formation.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                    <p className="text-gray-600 mb-6">{formation.description}</p>
                    <div className="flex items-center mb-3">
                        <Calendar className="mr-2 h-5 w-5 text-orange-600" />
                        <span> <span className='font-bold'>Starts: </span>{new Date(formation.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mb-3">
                        <Clock className="mr-2 h-5 w-5 text-orange-600" />
                        <span><span className='font-bold'>Ends: </span> {new Date(formation.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center ">
                        <User className="mr-2 h-5 w-5 text-orange-600" />
                        {formation.mentors.map((mentor) => `${mentor.firstName} ${mentor.lastName}`)}
                    </div>
                    </CardContent>
                    <CardFooter className="bg-orange-50 flex flex-col sm:flex-row justify-between p-6 gap-4">
                    <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-100 rounded-full px-6 w-full sm:w-auto">
                        <Book className="mr-2 h-4 w-4" />
                        Details
                    </Button>
                    <Button className="bg-orange-500 text-white hover:bg-orange-600 rounded-full px-6 w-full sm:w-auto">
                        Enroll Now
                    </Button>
                    </CardFooter>
                </Card>
            ))}
            
            </div>
        </div>
    </div>
  )
}