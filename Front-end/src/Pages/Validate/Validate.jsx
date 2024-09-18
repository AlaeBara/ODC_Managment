import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, X } from "lucide-react";
import './CustomScrollbar.css'; 


const data = [
  { id: 1, email: "john@example.com", firstName: "John", lastName: "Doe", gender: "Male", birthDay: "1990-05-15", country: "USA", profession: "Developer", age: 33, phoneNumber: "+1234567890", educationLevel: "Master's", specialty: "Computer Science", participatedODC: "Yes", isPresent: false },
  { id: 2, email: "jane@example.com", firstName: "Jane", lastName: "Smith", gender: "Female", birthDay: "1988-09-22", country: "Canada", profession: "Designer", age: 35, phoneNumber: "+9876543210", educationLevel: "Bachelor's", specialty: "Graphic Design", participatedODC: "No", isPresent: true },
  { id: 3, email: "michael@example.com", firstName: "Michael", lastName: "Johnson", gender: "Male", birthDay: "1995-07-30", country: "UK", profession: "Project Manager", age: 29, phoneNumber: "+4456781234", educationLevel: "Bachelor's", specialty: "Business Administration", participatedODC: "Yes", isPresent: true },
  { id: 4, email: "emily@example.com", firstName: "Emily", lastName: "Davis", gender: "Female", birthDay: "1992-03-12", country: "Australia", profession: "Marketing Specialist", age: 32, phoneNumber: "+6123456789", educationLevel: "Master's", specialty: "Marketing", participatedODC: "No", isPresent: false },
  { id: 5, email: "chris@example.com", firstName: "Chris", lastName: "Lee", gender: "Male", birthDay: "1987-11-05", country: "South Korea", profession: "Data Scientist", age: 36, phoneNumber: "+821234567890", educationLevel: "PhD", specialty: "Data Science", participatedODC: "Yes", isPresent: true },
  { id: 6, email: "sara@example.com", firstName: "Sara", lastName: "Miller", gender: "Female", birthDay: "1993-08-21", country: "Germany", profession: "Engineer", age: 31, phoneNumber: "+49123456789", educationLevel: "Bachelor's", specialty: "Mechanical Engineering", participatedODC: "No", isPresent: false },
  { id: 7, email: "daniel@example.com", firstName: "Daniel", lastName: "Wilson", gender: "Male", birthDay: "1985-06-10", country: "USA", profession: "Architect", age: 39, phoneNumber: "+1239876543", educationLevel: "Master's", specialty: "Architecture", participatedODC: "Yes", isPresent: true },
  { id: 8, email: "olivia@example.com", firstName: "Olivia", lastName: "Brown", gender: "Female", birthDay: "1991-04-03", country: "France", profession: "Teacher", age: 33, phoneNumber: "+33123456789", educationLevel: "Bachelor's", specialty: "Education", participatedODC: "No", isPresent: false },
  { id: 9, email: "william@example.com", firstName: "William", lastName: "Martinez", gender: "Male", birthDay: "1994-12-15", country: "Spain", profession: "Lawyer", age: 29, phoneNumber: "+341234567890", educationLevel: "Master's", specialty: "Law", participatedODC: "Yes", isPresent: true },
  { id: 10, email: "linda@example.com", firstName: "Linda", lastName: "Anderson", gender: "Female", birthDay: "1996-01-25", country: "Sweden", profession: "Researcher", age: 28, phoneNumber: "+46123456789", educationLevel: "PhD", specialty: "Biology", participatedODC: "No", isPresent: true }
];

const ComprehensiveTable = () => {
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [userPresence, setUserPresence] = useState({});

  const columns = [
    "email", "firstName", "lastName", "gender", "birthDay", "country",
    "profession", "age", "phoneNumber", "educationLevel", "specialty",
    "participatedODC"
  ];

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
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
                                <tr key={item.id}>
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
                                    checked={userPresence[item.id] || false}
                                    onCheckedChange={(checked) => handlePresenceChange(item.id, checked)}
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
