import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Slice
import { addUser } from "../utils/userSlice";

// Constants
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          // so that browser will set the cookie as in backend we have set it "credentials: true"
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data));

      navigate("/");
    } catch (error) {}
  };

  return (
    <div className="mx-auto mt-24 card bg-base-300 w-96 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mx-auto">Login</h2>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label>Email ID</label>
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="input w-full max-w-xs"
            />
          </div>

          <div className="space-y-2">
            <label>Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full max-w-xs"
            />
          </div>
        </div>

        <div className="card-actions justify-center mt-2">
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
