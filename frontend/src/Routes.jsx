import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Auth/Login";
import Register from "./Screens/Auth/Register";
import UserLayout from "./Screens/User/UserLayout";
import Dashboard from "./Screens/User/Dashboard";
import { SettingsPage } from "./Screens/User/SettingsPage";

import ChatBotPage from "./Screens/User/ChatBotPage";
import ReportsPage from "./Screens/User/ReportsPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<UserLayout />}>
          <Route path="/user/dashboard" exact element={<Dashboard />} />
          <Route path="/user/settings" exact element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
