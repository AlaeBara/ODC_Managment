import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Security/ProtectedRoutes.jsx';
import MainLayout from './MainLayout';

// Lazy load components
const Login = lazy(() => import('./Pages/Login/Login'));
const Home = lazy(() => import('./Pages/Homepage/home'));
const Formation = lazy(() => import('./Pages/FormationPage/Formation'));
const UserProfile = lazy(() => import('./Pages/Profile/Profile.jsx'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/Home"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Formation/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UserProfile/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
