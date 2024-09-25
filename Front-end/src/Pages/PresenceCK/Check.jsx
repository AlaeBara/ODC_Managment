import React, { useState, useEffect, useCallback } from "react"
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, X, Search, Users, Info, Calendar, Sun, Moon, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CandidateCheck() {
  const [filter, setFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [name, setName] = useState(null)
  const { id } = useParams()
  const [data, setData] = useState([])
  const [formationDays, setFormationDays] = useState([])
  const [attendance, setAttendance] = useState({})
  const [isAttendanceChanged, setIsAttendanceChanged] = useState(false)
  
  const columns = ["email", "firstName", "lastName", "phoneNumber", "attendance"]



  const fetchCandidates = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/workFlow/CandidatesAvailable/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setData(response.data.data)
      setName(response.data.nameOfFormation)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    }
  }, [id])

  const fetchFormationDays = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/workFlow/FormationDays/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setFormationDays(response.data.days)
    } catch (error) {
      console.error('Error fetching formation days:', error)
    }
  }, [id])

  const fetchAttendance = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/workFlow/attendance/${id}/${today}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setAttendance(response.data.attendance)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }, [id])


  useEffect(() => {
    fetchCandidates()
    fetchFormationDays()
    fetchAttendance()
  }, [fetchCandidates, fetchFormationDays, fetchAttendance])

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value && value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1
    }
    return 0
  })

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortOrder("asc")
    }
  }

  const clearFilter = () => {
    setFilter("")
  }

  const handleAttendanceChange = (candidateId, period) => {
    setAttendance(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        [period]: !prev[candidateId]?.[period]
      }
    }))
    setIsAttendanceChanged(true)
  }

  const saveAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const candidateIds = Object.keys(attendance)
      const morning = candidateIds.reduce((acc, id) => {
        acc[id] = attendance[id]?.morning || false
        return acc
      }, {})
      const afternoon = candidateIds.reduce((acc, id) => {
        acc[id] = attendance[id]?.afternoon || false
        return acc
      }, {})

      await axios.post(`${import.meta.env.VITE_API_LINK}/api/workFlow/updatePresence`, {
        sessionDate: today,
        morning,
        afternoon,
        candidateIds
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })

      setIsAttendanceChanged(false)
      console.log("Attendance updated successfully")
    } catch (error) {
      console.error("Error saving attendance:", error)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const isTodayFormationDay = formationDays.some(day => day.startsWith(today))

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-orange-500 text-white">
            <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <span className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Formation: {name}</span>
              <div className="flex items-center space-x-2 text-orange-100">
                <Users className="h-5 w-5" />
                <span className="text-lg sm:text-xl font-semibold">
                  {filteredData.length} Candidate{filteredData.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-auto sm:max-w-md">
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Input
                      placeholder="Filter table..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border-2 border-orange-500 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-full transition-all duration-300 ease-in-out"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-4 w-4" />
                  </div>
                  <Button 
                    onClick={clearFilter} 
                    variant="outline" 
                    className="px-4 py-2 bg-white text-orange-500 border-2 border-orange-500 hover:bg-orange-50 rounded-full transition-all duration-300 ease-in-out"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className={`font-semibold  ${isTodayFormationDay ? 'text-green-600' : 'text-gray-600'}`}>
                  {isTodayFormationDay ? `${today}` : 'Not a formation day'}
                </span>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-orange-200">
                  <thead className="bg-orange-500 text-white">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                        >
                          {column === "attendance" ? (
                            <div className="flex items-center">
                              <span>Attendance</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 ml-2 inline-block cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>AM: 8:00 AM - 12:00 PM</p>
                                    <p>PM: 1:00 PM - 5:00 PM</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSort(column)}
                              className="flex items-center space-x-2 hover:text-orange-200 transition-colors duration-200"
                            >
                              <span>{column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim()}</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-orange-100">
                    <AnimatePresence mode="wait">
                      {sortedData.length === 0 ? (
                        <motion.tr
                          key="no-results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td colSpan={columns.length} className="p-4 text-center text-orange-500">
                            No results found
                          </td>
                        </motion.tr>
                      ) : (
                        sortedData.map((item) => (
                          <motion.tr 
                            key={item._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="hover:bg-orange-50 transition-colors duration-200"
                          >
                            {columns.map((column) => (
                              <td
                                key={column}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                              >
                                {column === "attendance" ? (
                                  isTodayFormationDay ? (
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={attendance[item._id]?.morning || false}
                                          onCheckedChange={() => handleAttendanceChange(item._id, 'morning')}
                                          className="border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                                        />
                                        <Sun className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm">AM</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={attendance[item._id]?.afternoon || false}
                                          onCheckedChange={() => handleAttendanceChange(item._id, 'afternoon')}
                                          className="border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                                        />
                                        <Moon className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm">PM</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">No attendance today</span>
                                  )
                                ) : (
                                  item[column] || '-'
                                )}
                              </td>
                            ))}
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {isAttendanceChanged && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 flex justify-end"
              >
                <Button
                  onClick={saveAttendance}
                  className="bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Attendance
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}