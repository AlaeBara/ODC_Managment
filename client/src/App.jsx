import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout.jsx';
import Spinner from './components/Spinner/Spinner.jsx';
import Validate from './Pages/Validate/Validate.jsx';
import Evaluation from './Pages/Evaluation/Evaluation.jsx';
import EvaluationForm from './Pages/Evaluation/Evaluationform.jsx';
import OverView from './Pages/beneficiare/OverView.jsx';
import EvaluationDashboard from './Pages/beneficiare/EvaluationDashboard.jsx';
import Check from './Pages/PresenceCK/Check.jsx';
import Cloud from './Pages/Cloud/Cloud.jsx';
import Notfound from './Pages/Notfound.jsx';

// Admin
import MainLayoutAdmin from './MainLayoutAdmin.jsx';

const Login = lazy(() => import('./Pages/Login/Login.jsx'));
const Home = lazy(() => import('./Pages/Homepage/home.jsx'));
const Formation = lazy(() => import('./Pages/FormationPage/Formation.jsx'));
const Profile = lazy(() => import('./Pages/Profile/Profile.jsx'));
const Calendar = lazy(() => import('./Pages/calendar/calendar.jsx'));
const Workflow = lazy(() => import('./Pages/Workflow/Workflow.jsx'));
const OneFormation = lazy(() => import('./Pages/Oneformation/FormationPage.jsx'));
const AdminProfile = lazy(() => import('./Admin/profile/Adminprofile.jsx'));
const Dashboard = lazy(() => import('./Admin/Dashboard/Dashboard.jsx'));
const Mentors = lazy(() => import('./Admin/MentorsPage/Mentors.jsx'));
const Formations = lazy(() => import('./Admin/Formations/Formations.jsx'));
const AdminCalendar = lazy(() => import('./Admin/Calendar/AdminCalendar.jsx'));

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
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/Formation" element={<MainLayout><Formation /></MainLayout>} />
          <Route path="/Profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} />
          <Route path="/workflow" element={<MainLayout><Workflow /></MainLayout>} />
          <Route path="/validate/:id" element={<MainLayout><Validate /></MainLayout>} />
          <Route path="/Check_Presence/:id" element={<MainLayout><Check /></MainLayout>} />
          <Route path="evaluation" element={<MainLayout><Evaluation /></MainLayout>} />
          <Route path="/evaluation/:id" element={<EvaluationForm />} />
          <Route path="/beneficiary/overview" element={<MainLayout><OverView /></MainLayout>} />
          <Route path="/evaluation/:id" element={<MainLayout><EvaluationDashboard /></MainLayout>} />
          <Route path="/formation/:id" element={<MainLayout><OneFormation /></MainLayout>} />
          <Route path="/cloud" element={<MainLayout><Cloud /></MainLayout>} />

          {/* Admin routes */}
          <Route path="/Dashboard" element={<MainLayoutAdmin><Dashboard /></MainLayoutAdmin>} />
          <Route path="/Mentors_Formations" element={<MainLayoutAdmin><Mentors /></MainLayoutAdmin>} />
          <Route path="/Formations" element={<MainLayoutAdmin><Formations /></MainLayoutAdmin>} />
          <Route path="/formation details/:id" element={<OneFormation />} />
          <Route path="/evaluation statistics/:id" element={<EvaluationDashboard />} />
          <Route path="/admin/profile" element={<MainLayoutAdmin><AdminProfile /></MainLayoutAdmin>} />
          <Route path="/admin/calendar" element={<MainLayoutAdmin><AdminCalendar /></MainLayoutAdmin>} />

          <Route path="*" element={<Notfound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
