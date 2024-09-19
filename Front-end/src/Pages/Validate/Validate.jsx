import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, X } from "lucide-react";
import './CustomScrollbar.css'; 

const ComprehensiveTable = () => {
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [userPresence, setUserPresence] = useState({});
  const { id } = useParams();
  const [data, setData] = useState([]);

  const columns = [
    "email", "firstName", "lastName", "gender", "birthdate", "country",
    "profession", "age", "phoneNumber", "educationLevel", "speciality",
    "participationInODC"
  ];

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/workFlow/candidates/${id}`, {
          headers: { 
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setData(response.data.data);

        
      } catch (error) {
        console.error('Error fetching candidates:', error);
        console.log('Failed to fetch candidates. Please try again.');
      }
    };

    fetchCandidates();
  }, [id]);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value && value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePresenceChange = (id, checked) => {
    setUserPresence((prev) => ({ ...prev, [id]: checked }));
  };

  const clearFilter = () => {
    setFilter("");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Filter table..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-64 text-sm p-2 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Button onClick={clearFilter} variant="outline" className="w-full sm:w-auto px-4">
            <X className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
        <span className="text-gray-500 text-sm mr-3">{filteredData.length} Candidate</span>
      </div>

      <div className="rounded-lg border border-gray-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <div style={{ maxHeight: "70vh", overflow: "auto" }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-sm font-medium text-orange-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => handleSort(column)}
                        className="flex items-center space-x-2"
                      >
                        <span>{column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim()}</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-medium text-orange-500 tracking-wider sticky right-0 bg-gray-50">
                    Present
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">
                      No results found
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item) => (
                    <tr key={item._id}>
                      {columns.map((column) => (
                        <td
                          key={column}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {item[column]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sticky right-0 bg-white">
                        <Checkbox
                          checked={userPresence[item._id] || false}
                          onCheckedChange={(checked) => handlePresenceChange(item._id, checked)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveTable;