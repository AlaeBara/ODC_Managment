import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Folder, File, Loader2, Trash2, AlertCircle, Cloud as CloudIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function  Cloud () {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loadingFolders, setLoadingFolders] = useState(true)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/cloud/folders` , {
          withCredentials: true,
        })
        setFolders(response.data.folders || [])
        setLoadingFolders(false)
      } catch (error) {
        setError('Error fetching folders')
        setLoadingFolders(false)
      }
    }

    fetchFolders()
  }, [])

  const fetchFilesFromFolder = async (folderId) => {
    setLoadingFiles(true)
    setSelectedFolder(folderId)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/cloud/folders/${folderId}/files ` , {
        withCredentials: true,
      })
      setFiles(response.data.files || [])
      setLoadingFiles(false)
    } catch (error) {
      setError('Error fetching files from the selected folder')
      setLoadingFiles(false)
    }
  }

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_LINK}/api/cloud/files/${fileId}`, {
        withCredentials: true,
      })
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId))
    } catch (error) {
      setError('Error deleting file')
    }
  }

  const deleteFolder = async (folderId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_LINK}/api/cloud/folders/${folderId}`, {
        withCredentials: true,
      })
      setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId))
      if (selectedFolder === folderId) {
        setFiles([])
        setSelectedFolder(null)
      }
    } catch (error) {
      setError('Error deleting folder')
    }
  }

  if (loadingFolders) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Alert variant="destructive" className="w-96">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center">
          <CloudIcon className="mr-4 h-12 w-12" />
            Cloud Storage
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center text-primary">
                <Folder className="mr-2 h-6 w-6" /> Folders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                {folders.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No folders found.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ul className="space-y-3">
                    {folders.map((folder) => (
                      <li key={folder.id} className="group relative">
                        <Button
                          variant={selectedFolder === folder.id ? "secondary" : "outline"}
                          className="w-full justify-start text-left rounded-lg group-hover:bg-secondary/50 transition-colors duration-300"
                          onClick={() => fetchFilesFromFolder(folder.id)}
                        >
                          <Folder className="mr-2 h-5 w-5" /> {folder.name}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-destructive hover:text-destructive hover:bg-destructive/20"
                          onClick={() => deleteFolder(folder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center text-primary">
                <File className="mr-2 h-6 w-6" /> Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFiles ? (
                <div className="flex items-center justify-center h-[calc(100vh-300px)]">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                  {!selectedFolder ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Select a folder to view its files.
                      </AlertDescription>
                    </Alert>
                  ) : files.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No files found in this folder.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <ul className="space-y-3">
                      {files.map((file) => (
                        <li key={file.id} className="group relative bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors duration-300">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left rounded-lg"
                            asChild
                          >
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-3 px-4 transition-colors duration-300"
                            >
                              <File className="mr-2 h-5 w-5 inline" /> {file.name}
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-destructive hover:text-destructive hover:bg-destructive/20"
                            onClick={() => deleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}