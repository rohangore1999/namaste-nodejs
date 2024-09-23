import React from "react";
import { Outlet } from "react-router-dom";

// Components
import Navbar from "./Navbar";
import Footer from "./Footer";

const Body = () => {
  return (
    <div>
      <Navbar />

      <div className="h-auto">
        {/* rendering child components */}
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Body;
