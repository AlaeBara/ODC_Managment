import React, { useState } from 'react';
import Form from './components/Forum';
import { PlusCircle, Edit, Trash2, Activity } from 'lucide-react';

const Formation = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddFormation = () => {
    setShowForm(!showForm);
  };

  const handleModifyFormation = () => {
    console.log("Modify formation clicked");
  };

  const handleDeleteFormation = () => {
    console.log("Delete formation clicked");
  };

  // Mock data for user activities
  const activities = [
    { id: 1, title: 'Completed Task 1', date: '2023-09-01' },
    { id: 2, title: 'Started Project A', date: '2023-09-02' },
    { id: 3, title: 'Attended Meeting', date: '2023-09-03' },
    { id: 4, title: 'Submitted Report', date: '2023-09-04' },
    { id: 5, title: 'Reviewed Document', date: '2023-09-05' },
    { id: 6, title: 'Updated Profile', date: '2023-09-06' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">


      {/* Left Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r lg:fixed lg:h-full overflow-y-auto">
        <div className="p-4 space-y-2">
          <button
            className="w-full p-2 text-black rounded flex items-center justify-center lg:justify-start hover:bg-gray-100 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            onClick={handleAddFormation}
          >
            <PlusCircle className="mr-2" size={20} />
            Add Formation
          </button>
          <button
            className="w-full p-2 text-black rounded flex items-center justify-center lg:justify-start hover:bg-gray-100 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            onClick={handleModifyFormation}
          >
            <Edit className="mr-2" size={20} />
            Modify Formation
          </button>
          <button
            className="w-full p-2 text-black rounded flex items-center justify-center lg:justify-start hover:bg-gray-100 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            onClick={handleDeleteFormation}
          >
            <Trash2 className="mr-2" size={20} />
            Delete Formation
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:ml-64 lg:mr-64">
        {showForm && (
          <div className="relative rounded">
            <Form />
          </div>
        )}
      </main>

      {/* Right Side - Activity Grid */}
      {/* <aside className="w-full lg:w-64 bg-white border-l lg:fixed lg:right-0 lg:top-0 lg:h-full overflow-y-auto">
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
      </aside> */}

      
    </div>
  );
};

export default Formation;