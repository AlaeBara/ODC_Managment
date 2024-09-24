"use client"

import React, { useState, useEffect, useCallback } from "react"
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, X, Search, Users, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CandidateCheck() {
  const [filter, setFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [name, setName] = useState(null)
  const { id } = useParams()
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(7)

  const columns = [
    "email", "firstName", "lastName", "phoneNumber"
  ]

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/workFlow/CandidatesAvailable/${id}`, {
        headers: { 
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      setData(response.data.data)
      setName(response.data.nameOfFormation)
    } catch (error) {
      console.error('Error fetching candidates:', error)
      console.log('Failed to fetch candidates. Please try again.')
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

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Formation:<span className="text-orange-500">  {name}</span>
            </h2>
            <div className="flex items-center space-x-2 text-orange-500 mt-2 sm:mt-0">
              <Users className="h-5 w-5" />
              <span className="font-semibold">
                {filteredData.length} Candidate{filteredData.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

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
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-orange-200">
              <thead className="bg-orange-500 text-white">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    >
                      <button
                        onClick={() => handleSort(column)}
                        className="flex items-center space-x-2 hover:text-orange-200 transition-colors duration-200"
                      >
                        <span>{column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim()}</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-orange-100">
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
                            {item[column]}
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

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-[70px] ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent">
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
            <div className="flex space-x-2">
              <Button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                size="icon"
                variant="outline"
                className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-md transition-colors duration-300"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                size="icon"
                variant="outline"
                className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-md transition-colors duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                size="icon"
                variant="outline"
                className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-md transition-colors duration-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                size="icon"
                variant="outline"
                className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-md transition-colors duration-300"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}