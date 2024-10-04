'use client'

import React, { useState, useEffect } from 'react'
import Form from './components/Forum'
import EditeForm from './components/EditFormation'
import { PlusCircle, Edit, Trash2, ChevronRight } from 'lucide-react'
import EventDisplay from './components/EventDisplay'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { format } from "date-fns"
import { Button } from '@/components/ui/button'
import ConfirmModal from './components/ConfirmModal'

export default function Formation() {
  const [showForm, setShowForm] = useState(false)
  const [allFormations, setAllFormations] = useState([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedForDeletion, setSelectedForDeletion] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleAddFormation = () => {
    setShowForm(!showForm)
    setShowSidebar(false)
    setEditMode(false)
    setDeleteMode(false)
  }

  const handleModifyFormation = () => {
    setEditMode(!editMode)
    setShowSidebar(false)
    setShowForm(false)
    setDeleteMode(false)
  }

  const handleDeleteFormation = () => {
    setDeleteMode(!deleteMode)
    setShowSidebar(false)
    setShowForm(false)
    setEditMode(false)
    setSelectedForDeletion([])
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const handleSelectForDeletion = (id) => {
    setSelectedForDeletion(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    )
  }

  const getFormations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/api/courses/GetFormations`,
        { withCredentials: true }
      )
      setAllFormations(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      if (error.response?.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("An error occurred while fetching courses.")
      }
    }
  }

  useEffect(() => {
    getFormations()
  }, [])
 
  const onSubmit = async (data, tags) => {
    const formattedData = {
      title: data.fullName,
      type: data.type,
      description: data.description,
      dateRange: {
        startDate: format(data.dateRange.from, "yyyy-MM-dd"),
        endDate: format(data.dateRange.to, "yyyy-MM-dd"),
      },
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/api/courses/Addformation`,
        {
          title: formattedData.title,
          description: formattedData.description,
          startDate: formattedData.dateRange.startDate,
          endDate: formattedData.dateRange.endDate,
          type: formattedData.type,
          tags: tags,
        },
        {
          withCredentials: true,
        }
      )
      if (response.status === 200) {
        toast.success("Formation added successfully!")
        getFormations()
      } else {
        toast.success(response.data.message)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error.response.data.error)
        console.error(error)
      }
    }
  }

  const onSubmitEdite = async (data, tags, id) => {
    const originalFormation = allFormations.find(f => f._id === id)

    if (!originalFormation) {
      console.error('Formation not found:', id)
      toast.error('Formation not found.')
      return
    }
  
    const formattedData = {
      title: data.fullName,
      type: data.type,
      description: data.description,
      dateRange: {
        startDate: format(data.dateRange.from, "yyyy-MM-dd"),
        endDate: format(data.dateRange.to, "yyyy-MM-dd"),
      },
      tags: tags,
    }
  
    const originalData = {
      title: originalFormation.title,
      type: originalFormation.type,
      description: originalFormation.description,
      dateRange: {
        startDate: format(new Date(originalFormation.startDate), "yyyy-MM-dd"),
        endDate: format(new Date(originalFormation.endDate), "yyyy-MM-dd"),
      },
      tags: originalFormation.tags || [],
    }
  
    const arraysEqual = (a, b) => {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
      }
      return true
    }
  
    const hasChanges = JSON.stringify(formattedData) !== JSON.stringify({
      ...originalData,
      tags: formattedData.tags,
    }) || !arraysEqual(formattedData.tags, originalData.tags)
  
    if (!hasChanges) {
      toast('No changes detected.', {
        icon: '⚠️',
      })
      return
    }
  
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_LINK}/api/courses/UpdateFormations/${id}`,
        {
          title: formattedData.title,
          description: formattedData.description,
          startDate: formattedData.dateRange.startDate,
          endDate: formattedData.dateRange.endDate,
          type: formattedData.type,
          tags: formattedData.tags,
        },
        {
          withCredentials: true,
        }
      )
  
      if (response.status === 200) {
        toast.success("Course updated successfully")
        getFormations()
      } else {
        toast.success(response.data.message)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error.response.data.error)
        console.error(error)
      }
    }
  }
 
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/api/courses/DeleteFormations`,
        { ids: selectedForDeletion },
        { withCredentials: true }
      )

      if (response.status === 200) {
        toast.success("Selected formations deleted successfully!")
        getFormations()
        setSelectedForDeletion([])
        setShowConfirmModal(false)
        setDeleteMode(!deleteMode)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error deleting formations:', error)
      toast.error("An error occurred while deleting formations.")
    }
  }

  const showmodel = () => {
    if (selectedForDeletion.length === 0) {
      toast.error("No formations selected for deletion.")
      return
    }
    setShowConfirmModal(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      
      <button
        className={`lg:hidden fixed top-1/2 -translate-y-1/2 left-0 z-40 p-1 bg-white rounded-r-md shadow-md transition-transform duration-300 ${
          showSidebar ? 'translate-x-64' : 'translate-x-0'
        }`}
        onClick={toggleSidebar}
      >
        <ChevronRight 
          size={24} 
          className={`transition-transform duration-300 ${showSidebar ? 'rotate-180' : ''}`}
        />
      </button>

      <aside className={`w-64 bg-white border-r lg:fixed lg:left-0 lg:top-16 lg:bottom-0 overflow-y-auto transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed top-16 bottom-0 z-30`}>
        <div className="p-4 space-y-2">
          <Button
            className="w-full justify-start text-white bg-green-500"
            onClick={handleAddFormation}
            variant="outline"
          >
            <PlusCircle className="mr-2" size={20} />
            Add Formation
          </Button>
          <Button
            className="w-full justify-start text-white bg-orange-500  "
            onClick={handleModifyFormation}
            variant="outline"
          >
            <Edit className="mr-2" size={20} />
            Modify Formation
          </Button>
          <Button
            className="w-full justify-start text-white  bg-red-500"
            onClick={handleDeleteFormation}
            variant="outline"
          >
            <Trash2 className="mr-2" size={20} />
            Delete Formation
          </Button> 

          {deleteMode && (
          <div className="flex justify-center items-center mb-4 pt-4">
            <Button onClick={showmodel} variant="destructive">
              Delete {selectedForDeletion.length} Formations
            </Button>
          </div>
        )}
        </div>
      </aside>

      <main className="flex-1 p-4 lg:ml-64 flex flex-col">
        
        
        {showConfirmModal && (
          <ConfirmModal
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirmDelete}
          />
        )}

        <div className="flex flex-col space-y-4">
          <div className={`transition-all duration-1000 ease-in-out ${
            showForm ? 'max-h-full opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="relative rounded">
              <Form onSubmit={onSubmit} />
            </div>
          </div>

          <div className={`transition-all duration-1000 ease-in-out ${
            editMode ? 'max-h-full opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="relative rounded">
              <EditeForm allFormations={allFormations} onSubmit={onSubmitEdite} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-left text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-5">
            Events Available
          </h1>
          <EventDisplay 
            allFormations={allFormations} 
            deleteMode={deleteMode}
            selectedForDeletion={selectedForDeletion}
            onSelectForDeletion={handleSelectForDeletion}
          />
        </div>
      </main>
    </div>
  )
}