import React from 'react';
import SideBar from './components/SideBar/SideBar';

function MainLayoutAdmin({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <SideBar />
      <main className="transition-all duration-300 lg:ml-64">
        <div className="p-4 ">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayoutAdmin;