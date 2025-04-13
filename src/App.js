import { Navigate } from 'react-router-dom';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/Signup';
import StudentDashboard from "./pages/StudentDashboard";
import ClubDetails from "./pages/ClubDetails";
import SignInPage from './pages/SignInPage';
import ClubMembership from "./pages/ClubMembership"; // Import the new page
import AdminDashboard from "./pages/AdminDashboard";
import ManageClubs from "./pages/ManageClubs";
import ManageEvents from "./pages/ManageEvents";
import ViewReports from "./pages/ViewReports";
import ApproveMemberships from "./pages/ApproveMemberships";
import ProtectedRoute from './ProtectedRoute';

 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
       <Route path="/login" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}/>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/club/:id" element={<ClubDetails />} />
        <Route path="/club/:clubId/members" element={<ClubMembership />} /> {/* Add route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-clubs" element={<ManageClubs />} />
        <Route path="/admin/manage-events" element={<ManageEvents />} />
        <Route path="/admin/view-reports" element={<ViewReports />} />
        <Route path="/admin/approve-memberships" element={<ApproveMemberships />} />
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
