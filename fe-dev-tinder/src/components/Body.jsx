import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

// Components
import Navbar from "./Navbar";
import Footer from "./Footer";

// Utils
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Body = () => {
  const userData = useSelector((store) => store.userData);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true, // backend is expecting this
      });

      dispatch(addUser(res.data));
    } catch (e) {
      if (e.status === 401) {
        navigate("/login");
      }

      console.error("Error: " + e);
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
  }, []);

  return (
    <div>
      <Navbar />

      <div className="h-[100vh]">
        {/* rendering child components */}
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Body;
