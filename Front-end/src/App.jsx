import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import NavBar from './components/NavBar/NavBar';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavBar/>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
