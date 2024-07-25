import React from 'react';

import Sidebar from '../../Components/Sidebar.jsx/Sidebar';
import Header from '../../Components/Header.jsx/Header';
// import ThemeSwitcher from '../../Components/ThemeSwitch/ThemeSwitch'; // will add it later
import { Outlet } from 'react-router-dom';

const UserLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white font-roboto">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white mr-4 ">
          <div className=" mx-auto ">
            < Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
