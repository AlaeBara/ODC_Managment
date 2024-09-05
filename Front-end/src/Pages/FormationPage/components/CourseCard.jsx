import React, { useState } from 'react';
import { Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const CourseCard = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => setIsExpanded(!isExpanded);

  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const mentor = course.mentors[0] || {};

  return (
    <Card className="w-64 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col text-sm m-4">
      <CardHeader className="bg-orange-500 text-white p-2 rounded-t-lg">
        <CardTitle className="text-base font-bold truncate">{course.title}</CardTitle>
        <CardDescription className="text-white flex items-center mt-1 text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 flex-grow">
        <p className="text-gray-700 mb-2 text-xs">
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
