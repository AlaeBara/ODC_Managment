import React, { useState, useEffect } from 'react';
import Form from './components/Forum';
import { PlusCircle, Edit, Trash2, Activity, ChevronRight } from 'lucide-react';
import EventDisplay from './components/EventDisplay';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; 
import { format } from "date-fns";

const Formation = () => {
  const [showForm, setShowForm] = useState(false);
  const [allFormations, setAllFormations] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleAddFormation = () => {
    setShowForm(!showForm);
    setShowSidebar(false);
  };

  const handleModifyFormation = () => {
    console.log("Modify formation clicked");
    setShowSidebar(false);
  };

  const handleDeleteFormation = () => {
    console.log("Delete formation clicked");
    setShowSidebar(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const activities = [
    { id: 1, title: 'Completed Task 1', date: '2023-09-01' },
    { id: 2, title: 'Started Project A', date: '2023-09-02' },
    { id: 3, title: 'Attended Meeting', date: '2023-09-03' },
    { id: 4, title: 'Submitted Report', date: '2023-09-04' },
    { id: 5, title: 'Reviewed Document', date: '2023-09-05' },
    { id: 6, title: 'Updated Profile', date: '2023-09-06' },
  ];

  const getFormations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/api/courses/GetFormations`,
        { withCredentials: true }
      );
      setAllFormations(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while fetching courses.");
      }
    }
  };

  useEffect(() => {
    getFormations();
  }, []);

  const onSubmit = async (data, tags) => {
    const formattedData = {
      title: data.fullName,
      type: data.type,
      description: data.description,
      dateRange: {
        startDate: format(data.dateRange.from, "yyyy-MM-dd"),
        endDate: format(data.dateRange.to, "yyyy-MM-dd"),
      },
    };

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
      );
      if (response.status === 200) {
        toast.success("Formation added successfully!");
        getFormations();
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response.data.error);
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Toggle button for sidebar on mobile */}
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

      {/* Left Sidebar */}
      <aside className={`w-64 bg-white border-r lg:fixed lg:left-0 lg:top-16 lg:bottom-0 overflow-y-auto transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed top-16 bottom-0 z-30`}>
        <div className="p-4 space-y-2">
          <button
            className="w-full p-2 text-black rounded flex items-center justify-center lg:justify-start hover:bg-gray-100 focus:outline-none"
            onClick={handleAddFormation}
          >
            <PlusCircle className="mr-2" size={20} />
            Add Formation
          </button>
          <button
            className="w-full p-2 text-black rounded flex items-center justify-center lg:justify-start hover:bg-gray-100 focus:outline-none"
            onClick={handleModifyFormation}
          >
            <Edit className="mr-2" size={20} />
            Modify Formation
          </button>
          <button
            className="w-full p-2 text-black rounded flex items-center justify-center lg:justify-start hover:bg-gray-100 focus:outline-none"
            onClick={handleDeleteFormation}
          >
            <Trash2 className="mr-2" size={20} />
            Delete Formation
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:ml-64 lg:mr-64 mt-4">
        <div
          className={`transition-all duration-1000 ease-in-out ${
            showForm ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="relative rounded">
            <Form onSubmit={onSubmit} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-left text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-5">
            Events Available
          </h1>
          <EventDisplay allFormations={allFormations} />
        </div>
      </main>

      {/* Right Side - Activity Grid */}
      <aside className="w-full lg:w-64 bg-white border-l lg:fixed lg:right-0 lg:top-16 lg:bottom-0 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2" size={24} />
            Recent Activities
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-gray-50 p-3 rounded shadow-sm">
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Formation;