import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const endpoint = isAdmin ? 'verifier_admin' : 'validate-token';
        const response = await axios.get(`${import.meta.env.VITE_API_LINK}/api/auth/${endpoint}`, { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAdmin]);

  if (loading) return <div></div>;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;