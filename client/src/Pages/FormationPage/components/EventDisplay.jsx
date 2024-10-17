import React, { useState, useEffect } from 'react';
import { Search, Calendar, Tag, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CourseCard from './CourseCard';

const EventDisplay = ({ allFormations, deleteMode, selectedForDeletion, onSelectForDeletion }) => {
  const [filteredEvents, setFilteredEvents] = useState(allFormations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  const [expanded, setExpanded] = useState(false);
  const [randomTags, setRandomTags] = useState([]);

  const shuffleArray = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const allTags = [...new Set(allFormations.flatMap(formation => formation.tags))];
    const shuffledTags = shuffleArray(allTags).slice(0, 9);
    setRandomTags(shuffledTags);
  }, [allFormations]);

  useEffect(() => {
    const filtered = allFormations.filter(formation => {
      const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => formation.tags.includes(tag));
      const matchesDateRange = (!startDate || new Date(formation.startDate) >= new Date(startDate)) &&
                               (!endDate || new Date(formation.endDate) <= new Date(endDate));
      return matchesSearch && matchesTags && matchesDateRange;
    });
    setFilteredEvents(filtered);
    setDisplayCount(6);
    setExpanded(false);
  }, [allFormations, searchTerm, selectedTags, startDate, endDate]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setStartDate('');
    setEndDate('');
  };

  const loadMoreEvents = () => {
    setDisplayCount(filteredEvents.length);
    setExpanded(true);
  };

  const hideMoreEvents = () => {
    setDisplayCount(6);
    setExpanded(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 bg-white sm:shadow rounded-lg p-4">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4 p-4 md:p-0">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-col w-full items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2 md:w-auto">
            <div className="flex items-center space-x-2 w-35 sm:w-auto">
              <Calendar className="text-gray-400" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-35 sm:w-35 border border-gray-300 rounded-md py-2 px-4 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              />
            </div>

            <div className="flex items-center space-x-2 w-35 sm:w-auto">
              <span className="text-gray-400">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-35 sm:w-35 border border-gray-300 rounded-md py-2 px-4 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <Button
            onClick={clearFilters}
            variant="outline"
            className="flex items-center justify-center w-full md:w-auto border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="md:mt-4 sm:mt-2 flex flex-col items-center justify-center p-4 md:p-0">
          <div className="flex flex-wrap gap-2 justify-center">
            {randomTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">{filteredEvents.length} formations found</span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
        {filteredEvents.slice(0, displayCount).map((course) => (
          <CourseCard 
            key={course._id} 
            course={course} 
            deleteMode={deleteMode}
            isSelected={selectedForDeletion.includes(course._id)}
            onSelectForDeletion={onSelectForDeletion}
          />
        ))}
      </div>

      {filteredEvents.length > displayCount && !expanded && (
        <div className="mt-8 text-center">
          <Button onClick={loadMoreEvents} variant="outline" className="flex items-center mx-auto">
            See More <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {expanded && (
        <div className="mt-8 text-center">
          <Button onClick={hideMoreEvents} variant="outline" className="flex items-center mx-auto">
            Hide More <ChevronUp className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No events available</p>
      )}
    </div>
  );
};

export default EventDisplay;