import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Mentors = () => {
  const [mentorsData, setMentorsData] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorsData = await axios.get(`${import.meta.env.VITE_API_LINK}/api/admin/allmentors`, { 
          withCredentials: true 
        });
        setMentorsData(mentorsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleMentorClick = (mentorId) => {
    setSelectedMentor(selectedMentor === mentorId ? null : mentorId);
  };

  return (
    <div className="p-4">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mentors List - Left Side */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Users className="mr-2" /> Our Mentors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {mentorsData.map((mentor) => (
                  <Card 
                    key={mentor._id} 
                    className={`overflow-hidden bg-white shadow-md rounded-lg transition-all duration-300 hover:shadow-lg
                      ${selectedMentor === mentor._id ? 'border-2 border-orange-500' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 border-2 border-orange-200">
                          <AvatarImage 
                            src={mentor.profilePic} 
                            alt={`${mentor.firstName} ${mentor.lastName}`} 
                          />
                          <AvatarFallback className="bg-orange-200 text-orange-800">
                            {mentor.firstName[0]}{mentor.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {mentor.firstName} {mentor.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{mentor.email}</p>
                        </div>
                        <Button
                          onClick={() => handleMentorClick(mentor._id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                        >
                          {selectedMentor === mentor._id ? 'Hide Details' : 'View Details'}
                          {selectedMentor === mentor._id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Formation Details - Right Side */}
        <div className="lg:col-span-5">
          {selectedMentor ? (
            <Card className="bg-orange-50 border-orange-200 sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                  Formation Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Formation Info Card */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Specialization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        {mentorsData.find(m => m._id === selectedMentor)?.specialization || "Web Development"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Experience Card */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        {mentorsData.find(m => m._id === selectedMentor)?.experience || "5+ years"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Skills Card */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(mentorsData.find(m => m._id === selectedMentor)?.skills || 
                          ["React", "Node.js", "JavaScript"]).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-orange-50 border-orange-200 h-full flex items-center justify-center">
              <CardContent className="text-center p-8">
                <Briefcase className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a mentor to view their formation details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentors;