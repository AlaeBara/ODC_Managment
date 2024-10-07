import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Security/ProtectedRoutes.jsx';
import MainLayout from './MainLayout';
import Spinner from './components/Spinner/Spinner.jsx';
import Validate from './Pages/Validate/Validate.jsx';
import Evaluation from './Pages/Evaluation/Evaluation.jsx';
import EvaluationForm from './Pages/Evaluation/Evaluationform.jsx';
import OverView from './Pages/beneficiare/OverView.jsx'
import EvaluationDashboard from './Pages/beneficiare/EvaluationDashboard.jsx'
import Check from './Pages/PresenceCK/Check.jsx';
import Cloud from './Pages/Cloud/Cloud.jsx';




//admin 
import Dashboard from './Admin/Dashboard/Dashboard.jsx'
import ProtectedRoutesAdmin  from './Security/ProtectedRoutesAdmin.jsx'


// Lazy load components
const Login = lazy(() => import('./Pages/Login/Login'));
const Home = lazy(() => import('./Pages/Homepage/home'));
const Formation = lazy(() => import('./Pages/FormationPage/Formation'));
const Profile = lazy(() => import('./Pages/Profile/Profile.jsx'));
const Calendar = lazy(() => import('./Pages/calendar/calendar.jsx'));
const Workflow = lazy(() => import('./Pages/Workflow/Workflow.jsx'));
const OneFormation = lazy(() => import('./Pages/Oneformation/FormationPage.jsx'));

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
                  <Validate/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Check_Presence/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Check/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="evaluation"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Evaluation/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/evaluation/:id" 
            element={<EvaluationForm />} 
          />
          <Route
            path="/beneficiary/overview"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OverView/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/evalution/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EvaluationDashboard/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/formation/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OneFormation/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/cloud"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Cloud/>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* admin routes */}
        <Routes>
          <Route
              path="/Dashboard"
              element={ 
                <ProtectedRoutesAdmin >
                  <Dashboard/>
                </ProtectedRoutesAdmin>
              }
          />
        </Routes>
        
      </Suspense>
    </Router>
  );
}

export default App;