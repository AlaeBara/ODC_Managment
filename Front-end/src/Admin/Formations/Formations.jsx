import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Calendar, User, X, Clock, Book, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'

export default function Formations() {
  const [formations, setFormations] = useState([])
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [mentors, setMentors] = useState([])
  const [selectedMentor, setSelectedMentor] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

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


  const formationDetails = (id) =>{
    console.log(id)
    navigate(`/formation details/${id}`)
  }

  const evalutionDetails = (id) =>{
    console.log(id)
    navigate(`/evalution statistics/${id}`)
  }


  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-lato">Available Formations</h1>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
                <Input
                  type="text"
                  value={search}
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-orange-500 w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 border-orange-500 w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 border-orange-500 w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                />
              </div>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger className="border-orange-500 ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent">
                  <User className="mr-2 h-4 w-4 text-orange-500" />
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
              <div className="flex space-x-2">
                <Button onClick={fetchFilteredFormations} className="bg-orange-500 hover:bg-orange-600 text-white flex-grow">
                  Search
                </Button>
                <Button onClick={handleClear} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {message && (
          <div className="bg-orange-50 border border-orange-500 text-orange-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((formation, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-white rounded-lg transform hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  <span className="flex-grow truncate mr-2 font-lato">{formation.title}</span>
                  <ChevronRight className="h-5 w-5 flex-shrink-0" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-semibold">{new Date(formation.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm font-semibold">{new Date(formation.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-500">Mentor</p>
                      <p className="text-sm font-semibold">{formation.mentors.map((mentor) => `${mentor.firstName} ${mentor.lastName}`).join(', ')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t flex justify-end p-3 gap-2">

                <Button onClick={() => formationDetails(formation._id)} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full px-4 py-1 text-sm">
                  <Book className="mr-1 h-3 w-3" />
                  Details Formation
                </Button>
                <Button onClick={() =>evalutionDetails(formation._id)} className="bg-orange-500 text-white hover:bg-orange-600 rounded-full px-4 py-1 text-sm">
                  Evalution
                </Button>

              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}