import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Formations = () => {
  const [formations, setFormations] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [message, setMessage] = useState(''); // To display messages like "No formations found"

  // Fetch mentors for the picker
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Mentors`, { withCredentials: true });
        setMentors(response.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    fetchMentors();
  }, []);

  // Fetch all formations when the component mounts or inputs are cleared
  useEffect(() => {
    const fetchAllFormations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Filtrage`, { withCredentials: true });
        setFormations(response.data.courses);
      } catch (error) {
        console.error('Error fetching formations:', error);
      }
    };

    // Check if search fields are cleared and fetch all formations if they are
    if (!search && !startDate && !endDate && !selectedMentor) {
      fetchAllFormations();
    }
  }, [search, startDate, endDate, selectedMentor]);

  // Fetch formations with mentor filter automatically when a mentor is selected
  useEffect(() => {
    const fetchFormationsByMentor = async () => {
      if (selectedMentor) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Filtrage`, {
            params: {
              mentorId: selectedMentor,
            },
            withCredentials: true,
          });

          if (response.data.courses.length === 0) {
            setMessage('No formations found for this mentor'); // Show message when no formations are found
            setFormations(response.data.courses);
          } else {
            setMessage(''); // Clear message if formations exist
            setFormations(response.data.courses);
          }
        } catch (error) {
          setMessage('Error fetching formations for mentor'); // Display message if an error occurs
          console.error('Error fetching formations:', error);
        }
      }
    };

    fetchFormationsByMentor();
  }, [selectedMentor]); // Trigger when mentor is selected

  // Fetch formations with other filters (search and dates) on button click
  const fetchFilteredFormations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/formation/Filtrage`, {
        params: {
          search,
          startDate,
          endDate,
          mentorId: selectedMentor, // Pass the selected mentor
        },
        withCredentials: true,
      });

      if (response.data.courses.length === 0) {
        setMessage('No formations found for the given criteria'); // Show message when no formations are found
        setFormations(response.data.courses);
      } else {
        setMessage(''); // Clear message if formations exist
        setFormations(response.data.courses); // Only set formations if there are results
      }
    } catch (error) {
      setMessage('Error fetching formations'); // Display message if an error occurs
      console.error('Error fetching formations:', error);
    }
  };

  // Handle clearing inputs and resetting filters
  const handleClear = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setSelectedMentor('');
    setMessage(''); // Clear the message
    // Optionally, you can fetch all formations again
    // fetchAllFormations(); // Uncomment this if you want to fetch all formations again
  };

  return (
    <div className="p-6">
      {/* Search Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={selectedMentor}
          onChange={(e) => setSelectedMentor(e.target.value)} // Trigger API call when mentor is selected
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Mentor</option>
          {mentors.map((mentor) => (
            <option key={mentor._id} value={mentor._id}>
              {mentor.firstName} {mentor.lastName}
            </option>
          ))}
        </select>
        <button
          onClick={fetchFilteredFormations} // Fetch filtered formations on button click (for search and dates)
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={handleClear} // Clear inputs and reset formations
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {/* Message if no formations are found */}
      {message && <p className="text-red-500 text-center">{message}</p>}

      {/* Formations Cards */}
      <div className="flex flex-wrap justify-center items-center gap-6">
        {formations.map((formation) => (
          <div
            key={formation._id}
            className="bg-white shadow-lg rounded-lg p-6 w-80"
          >
            <h3 className="text-xl font-semibold mb-2">{formation.title}</h3>
            <p className="text-gray-600 mb-4">{formation.description}</p>
            <p className="text-gray-500 mb-4">
              Start: {new Date(formation.startDate).toLocaleDateString()}
            </p>
            <p className="text-gray-500 mb-4">
              End: {new Date(formation.endDate).toLocaleDateString()}
            </p>
            <div className="flex justify-between mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Details</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">Enroll</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formations;
