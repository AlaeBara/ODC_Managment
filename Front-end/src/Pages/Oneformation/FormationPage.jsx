'use client'

import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, X, Search, Users, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Sun, Moon, Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FormationPage() {
  const [filter, setFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const { id } = useParams()
  const [data, setData] = useState([])
  const [formationInfo, setFormationInfo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(7)
  const [error, setError] = useState(null)
  const [expandedSessions, setExpandedSessions] = useState({})

  const columns = [
    "email", "firstName", "lastName", "gender", "birthdate", "country",
    "profession", "age", "phoneNumber", "educationLevel", "speciality",
    "participationInODC", "sessions"
  ]

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/presence/GetPresencedata/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      
      if (response.data.formation && response.data.candidates) {
        setData(response.data.candidates)
        setFormationInfo(response.data.formation)
      } else {
        console.error("Unexpected response structure:", response.data)
        setError("Received unexpected data structure from server")
        setData([])
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
      setError(error.response?.data?.message || "Failed to fetch candidates")
      setData([])
    }
  }, [id])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

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

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

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

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const handleRowsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
  }

  const toggleSessionExpand = (id) => {
    setExpandedSessions(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const formatSessions = (sessions, id) => {
    const isExpanded = expandedSessions[id]
    const displaySessions = isExpanded ? sessions : sessions.slice(0, 3)

    return (
      <div className="space-y-2">
        {displaySessions.map((session, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="font-medium">{new Date(session.sessionDate).toLocaleDateString()}:</span>
            <div className="flex items-center space-x-1">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Badge variant={session.morningStatus === "Present" ? "success" : "destructive"}>
                {session.morningStatus}
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Moon className="w-4 h-4 text-blue-500" />
              <Badge variant={session.afternoonStatus === "Present" ? "success" : "destructive"}>
                {session.afternoonStatus}
              </Badge>
            </div>
          </div>
        ))}
        {sessions.length > 3 && (
          <Button
            onClick={() => toggleSessionExpand(id)}
            variant="ghost"
            size="sm"
            className="mt-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show More ({sessions.length - 3} more)
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="p-8 flex flex-col space-y-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 flex flex-col"
      >
        {formationInfo && (
          <Card className="bg-gradient-to-r from-orange-400 to-orange-600 text-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">Formation Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2">Program</h3>
                  <p className="text-center">{formationInfo.title}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2">Start Date</h3>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <p>{new Date(formationInfo.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2">End Date</h3>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <p>{new Date(formationInfo.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <Clock className="w-5 h-5 mr-2" />
                <p className="text-lg">
                  Duration: {Math.max(Math.ceil((new Date(formationInfo.endDate) - new Date(formationInfo.startDate)) / (1000 * 60 * 60 * 24)), 1)} days

                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Filter table..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border-2 border-orange-500 focus:border-orange-600 rounded-full transition-all duration-300 ease-in-out"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-4 w-4" />
            </div>
            <Button onClick={clearFilter} variant="outline" className="w-full sm:w-auto px-6 py-2 bg-white text-orange-500 border-2 border-orange-500 hover:bg-orange-50 rounded-full transition-all duration-300 ease-in-out">
              <X className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-orange-500">
            <Users className="h-5 w-5" />
            <span className="font-semibold">
              {filteredData.length} Candidate{filteredData.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-orange-200">
                <thead className="bg-orange-500">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"
                      >
                        <button
                          onClick={() => handleSort(column)}
                          className="flex items-center space-x-2 hover:text-orange-200 transition-colors duration-200"
                        >
                          <span>{column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, " $1").trim()}</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-orange-200">
                  <AnimatePresence mode="wait">
                    {paginatedData.length === 0 ? (
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
                      paginatedData.map((item) => (
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
                              {column === "sessions" ? formatSessions(item[column], item._id) : item[column]}
                            </td>
                          ))}
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="7" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-1">
              <Button onClick={goToFirstPage} variant="outline" size="icon">
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button onClick={goToPrevPage} variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button onClick={goToNextPage} variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button onClick={goToLastPage} variant="outline" size="icon">
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}