import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, ChevronUp, Upload, Phone, UserCheck, Search, Users, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from "react-router-dom"


export default function Component() {
  const [formations, setFormations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFormation, setExpandedFormation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)
  const [upload, setUpload] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()



  //api for
  useEffect(() => {
    const fetchFormations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`,
          { credentials: "include" }
        )
        if (!response.ok) throw new Error("Failed to fetch formations")
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
    const startDate = new Date(formation.startDate);
    const endDate = new Date(formation.endDate);
    const today = new Date();
    
    // Normalize the time for startDate
    startDate.setHours(0, 0, 0, 0);

    // Set the end date cutoff to 7 PM
    endDate.setHours(19, 0, 0, 0);

    const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    const hasStarted = today >= startDate && today <= endDate;
    const hasEnded = today > endDate;

    if (hasEnded) {
      return { priority: 4, color: 'gray', text: 'Ended', description: 'Formation has ended', progress: 100 };
    } else if (hasStarted) {
      return { priority: 1, color: 'yellow', text: 'Ongoing', description: 'Happening now', progress: 50 };
    } else if (daysUntilStart < 7 && daysUntilStart >= 0) {
      return { priority: 2, color: 'red', text: 'Urgent', description: `Starts in ${daysUntilStart} day(s)`, progress: 90 };
    } else {
      return { priority: 3, color: 'green', text: 'Upcoming', description: 'More than 7 days away', progress: 10 };
    }
  };


  const filteredFormations = formations
    .filter(formation => {
      const importance = getImportanceLevel(formation)
      return (
        formation.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        importance.priority !== 4 // Exclude ended formations
      )
    })
    .sort((a, b) => getImportanceLevel(a).priority - getImportanceLevel(b).priority)

  const groupedFormations = filteredFormations.reduce((acc, formation) => {
    const importance = getImportanceLevel(formation)
    if (!acc[importance.text]) {
      acc[importance.text] = []
    }
    acc[importance.text].push(formation)
    return acc
  }, {})

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          selectedFile.type === "application/vnd.ms-excel") {
        setFile(selectedFile)
        setUpload(true)
        toast.info(`File "${selectedFile.name}" selected`)
      } else {
        toast.error("Please select an Excel file (.xlsx or .xls)")
        e.target.value = null
      }
    }
  }

  const handleUpload = async (id_Formation) => {
    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('id_Formation', id_Formation)

    try {
      await fetch(`${import.meta.env.VITE_API_LINK}/api/workFlow/upload-excel`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      toast.success('File uploaded successfully')
      setFile(null)
      setUpload(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error('Error uploading file', err)
      toast.error('File upload failed. Please try again.')
    }
  }

  const validateCandidates = (formationId) => navigate(`/validate/${formationId}`)

  const checkPresence = (formationId) => navigate(`/Check_Presence/${formationId}`)

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen p-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-orange-500 mb-8">
          Formations Workflow
        </h1>
        <div className="relative w-full max-w-md mb-12">
          <Input
            type="text"
            placeholder="Search formations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-full shadow-md ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 transition duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        {['Ongoing', 'Urgent', 'Upcoming'].map((status) => (
          groupedFormations[status] && groupedFormations[status].length > 0 && (
            <div key={status} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{status} Formations</h2>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {groupedFormations[status].map((formation) => {
                    const importance = getImportanceLevel(formation)
                    return (
                      <motion.div
                        key={formation._id}
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl bg-white rounded-lg">
                          <CardHeader className={`text-white bg-gradient-to-r from-orange-400 to-orange-500 py-4`}>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-xl font-bold truncate">{formation.title}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleExpand(formation._id)}
                                className="text-white hover:bg-white/20"
                                aria-label={expandedFormation === formation._id ? "Collapse formation details" : "Expand formation details"}
                              >
                                {expandedFormation === formation._id ? (
                                  <ChevronUp className="h-6 w-6" />
                                ) : (
                                  <ChevronDown className="h-6 w-6" />
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
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
                                <Clock className={`w-5 h-5 ${
                                  importance.color === 'red' ? 'text-red-600' : 
                                  importance.color === 'yellow' ? 'text-yellow-600' : 
                                  'text-green-600'
                                }`} />
                                <span className={`text-sm font-medium ${
                                  importance.color === 'red' ? 'text-red-600' : 
                                  importance.color === 'yellow' ? 'text-yellow-600' : 
                                  'text-green-600'
                                }`}>
                                  {importance.description}
                                </span>
                              </div>
                            </div>
                            <Progress 
                              value={importance.progress} 
                              className={`mb-6 h-2`}
                            />
                            <div className="flex items-center space-x-2 mb-4">
                              <Calendar className="w-5 h-5 text-gray-500" />
                              <p className="text-sm text-gray-600">
                                {`${new Date(formation.startDate).toLocaleDateString()} - ${new Date(formation.endDate).toLocaleDateString()}`}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">{formation.description}</p>
                            <div className="flex items-center justify-between mb-4">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200 rounded-full px-3 py-1">
                                {formation.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-5 h-5 text-gray-500" />
                              <p className="text-xs text-gray-500">
                                Mentors: {formation.mentors.map((mentor) => mentor.email).join(", ")}
                              </p>
                            </div>
                          </CardContent>
                          <AnimatePresence>
                            {expandedFormation === formation._id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                <CardFooter className="bg-gray-50 p-6">
                                  <div className="w-full space-y-4">
                                    <div className="flex items-center justify-center space-x-4">
                                      <Upload className="w-5 h-5 text-gray-600" />
                                      <span className="text-gray-700 font-medium">Import Candidates</span>
                                      <input 
                                        type="file" 
                                        accept=".xlsx, .xls" 
                                        onChange={handleFileChange} 
                                        ref={fileInputRef}
                                        className="hidden"
                                        id={`file-upload-${formation._id}`}
                                      />
                                      <label 
                                        htmlFor={`file-upload-${formation._id}`} 
                                        className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-md text-center"
                                      >
                                        Choose File
                                      </label>
                                    </div>
                                    {file && <p className="text-sm text-gray-600 text-center">Selected: {file.name}</p>}
                                    {upload && (
                                      <Button 
                                        size="sm" 
                                        className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200" 
                                        onClick={() => handleUpload(formation._id)}
                                      >
                                        Upload
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200" 
                                      onClick={() => validateCandidates(formation._id)}
                                    >
                                      <Phone className="w-4 h-4" />
                                      <span>Validate Candidates</span>
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200" 
                                      onClick={() => checkPresence(formation._id)}
                                    >
                                      <UserCheck className="w-4 h-4" />
                                      <span>Check Presence</span>
                                    </Button>
                                  </div>
                                </CardFooter>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        ))}
        
        {Object.keys(groupedFormations).length === 0 &&
          <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-9">
           <p className="text-lg font-medium">No Formation found.</p>
          </div>
        }
      </div>
    </div>
  )
}