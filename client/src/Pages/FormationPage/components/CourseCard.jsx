import React, { useState } from 'react';
import { Calendar, Tag, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';



const CourseCard = ({ course, deleteMode, isSelected, onSelectForDeletion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => setIsExpanded(!isExpanded);

  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const mentor = course.mentors[0] || {};

  return (
    <Card className={`w-80 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col text-sm m-4 ${deleteMode ? 'relative' : ''}`}>

      <CardHeader className={`bg-gradient-to-br from-orange-500 to-orange-700 text-white p-2 rounded-t-lg relative`}>
        {deleteMode && (
          <div className="absolute top-2 right-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelectForDeletion(course._id)}
              className="text-white border-white"
            />
          </div>
        )}
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-bold truncate">{course.title}</CardTitle>
            <CardDescription className="text-white flex items-center mt-1 text-ms">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
            </CardDescription>
          </div>
          {!deleteMode && <Link to={`/formation/${course._id}`}>
              <Button
                variant="secondary"
                size="icon"
                className="p-1 h-6 w-6 bg-white hover:bg-gray-100 transition-colors duration-200"
                title="View Course"
              >
                <Eye className="h-4 w-4 text-black " />
                <span className="sr-only">View Course</span>
              </Button>
            </Link>
          }
        </div>
      </CardHeader>

      <CardContent className="p-2 flex-grow">

        <p className="text-gray-700 mb-2 text-xs mb-4">
          {isExpanded ? course.description : truncateDescription(course.description, 60)}
        </p>

        {course.description.length > 60 && (
          <Button variant="link" onClick={toggleDescription} className="p-0 h-auto font-semibold text-orange-600 text-xs">
            {isExpanded ? (
              <>
                Less <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                More <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        )}

        <div className="flex items-center mt-2">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={mentor.avatar} alt={mentor.email || 'Mentor Avatar'} />
            <AvatarFallback>{mentor.email ? mentor.email[0] : 'M'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-xs">{mentor.email || 'Unknown Mentor'}</p>
            <p className="text-gray-600 text-xs">Mentor</p>
          </div>
        </div>

      </CardContent>
      
      <CardFooter className="p-2 flex gap-1 flex-wrap">
        {course.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>

  );
};

export default CourseCard;