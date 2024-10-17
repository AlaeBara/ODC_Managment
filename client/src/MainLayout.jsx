import React from 'react';
import NavBar from './components/NavBar/NavBar'

function MainLayout({ children }) {
  return (
    <div>
      <NavBar/>
      <main>
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
