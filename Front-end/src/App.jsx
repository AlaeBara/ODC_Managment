import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Security/ProtectedRoutes.jsx';
import MainLayout from './MainLayout';
import Spinner from './components/Spinner/Spinner.jsx';

// Lazy load components
const Login = lazy(() => import('./Pages/Login/Login'));
const Home = lazy(() => import('./Pages/Homepage/home'));
const Formation = lazy(() => import('./Pages/FormationPage/Formation'));
const Profile = lazy(() => import('./Pages/Profile/Profile.jsx'));
const Calendar = lazy(() => import('./Pages/calendar/calendar.jsx'));
const Workflow = lazy(() => import('./Pages/Workflow/Workflow.jsx'));
const OneFormation = lazy(() => import('./Pages/Oneformation/FormationPage.jsx'));
const Validate = lazy(() => import('./Pages/Validate/Validate.jsx'));
const Evaluation = lazy(() => import('./Pages/Evaluation/Evaluation.jsx'));
const EvaluationForm = lazy(() => import('./Pages/Evaluation/Evaluationform.jsx'));
const OverView = lazy(() => import('./Pages/beneficiare/OverView.jsx'));
const EvaluationDashboard = lazy(() => import('./Pages/beneficiare/EvaluationDashboard.jsx'));
const Check = lazy(() => import('./Pages/PresenceCK/Check.jsx'));
const Cloud = lazy(() => import('./Pages/Cloud/Cloud.jsx'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Formation"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Formation />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Calendar />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflow"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Workflow />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/validate/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Validate />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Check_Presence/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Check />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="evaluation"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Evaluation />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluation/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EvaluationForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiary/overview"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OverView />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiary/overview/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EvaluationDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/formation/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OneFormation />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cloud"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Cloud />
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
