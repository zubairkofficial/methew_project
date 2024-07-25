import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Auth/Login";
import UserLayout from "./Screens/User/UserLayout";
import Dashboard from "./Screens/User/Dashboard";
import { SettingsPage } from "./Screens/User/SettingsPage";
import ProtectedRoute from "./protectedRoute.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
          }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
