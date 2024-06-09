import React from "react";
import { Outlet } from "react-router-dom";
import Notification from "./Notification";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <header className="App-header">
        <Notification />
      </header>
      <div className="App-content">
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
