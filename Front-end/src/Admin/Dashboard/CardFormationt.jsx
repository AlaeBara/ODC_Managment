// CardEvent.js
import React from 'react';

const CardFormation= ({ icon , title, date, description, type, mentors }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex items-start">
        <div className="mr-4">
          <div className="bg-orange-200 text-orange-600 p-2 rounded-full">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">{date}</p>
          <p className="text-gray-500">{description}</p>
          <p>
            <span className="font-bold">Type:</span> <span className="text-red-500">{type}</span>
          </p>
          <p>
            <span className="font-bold">Mentors:</span> <span className="text-red-500">{mentors}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardFormation;
