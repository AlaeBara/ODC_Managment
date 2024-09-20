'use client'

import React, { useState, useEffect } from "react"
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, X, Search, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import './CustomScrollbar.css'

const ComprehensiveTable = () => {
  const [filter, setFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [userPresence, setUserPresence] = useState({})
  const { id } = useParams()
  const [data, setData] = useState([])

  const columns = [
    "email", "firstName", "lastName", "gender", "birthdate", "country",
    "profession", "age", "phoneNumber", "educationLevel", "speciality",
    "participationInODC"
  ]

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/workFlow/candidates/${id}`, {
          headers: { 
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        setData(response.data.data)
      } catch (error) {
        console.error('Error fetching candidates:', error)
        console.log('Failed to fetch candidates. Please try again.')
      }
    }

    fetchCandidates()
  }, [id])

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

  const handlePresenceChange = (id, checked) => {
    setUserPresence((prev) => ({ ...prev, [id]: checked }))
  }

  const clearFilter = () => {
    setFilter("")
  }

  return (
    <div className="bg-white p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Filter table..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border-2 border-orange-500 focus:border-orange-600 rounded-full transition-all duration-300 ease-in-out ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
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
              {filteredData.length} Candidate{filteredData.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-orange-200">
                <thead className="bg-orange-500 sticky top-0 z-10">
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
                          <span>{column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim()}</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider sticky right-0 bg-orange-500">
                      Present
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-orange-200">
                  <AnimatePresence>
                    {sortedData.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={columns.length + 1} className="p-4 text-center text-orange-500">
                          No results found
                        </td>
                      </motion.tr>
                    ) : (
                      sortedData.map((item, index) => (
                        <motion.tr 
                          key={item._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 sticky right-0 bg-white">
                            <Checkbox
                              checked={userPresence[item._id] || false}
                              onCheckedChange={(checked) => handlePresenceChange(item._id, checked)}
                              className="border-orange-500 text-orange-500 focus:ring-orange-500 rounded-full transition-all duration-300 ease-in-out
                                         data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ComprehensiveTable