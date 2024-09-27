import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Slice
import { addUser } from "../utils/userSlice";

// Constants
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

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
    } catch (error) {
      setErrMsg(error?.response?.data);
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data))

      navigate('/profile')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto mt-24 card bg-base-300 w-96 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mx-auto">
          {isLoginPage ? "Login" : "Sign Up"}
        </h2>

        {!isLoginPage && (
          <>
            {" "}
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input w-full max-w-xs"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input w-full max-w-xs"
                />
              </div>
            </div>
          </>
        )}

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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full max-w-xs"
            />
          </div>
        </div>

        {errMsg && <p className="text-red-500">{errMsg}</p>}

        <div className="card-actions justify-center mt-2">
          <button
            className="btn btn-primary"
            onClick={isLoginPage ? handleLogin : handleSignUp}
          >
            {isLoginPage ? "Login" : "Sign Up"}
          </button>
        </div>

        {isLoginPage ? (
          <p>
            New User? <span className="cursor-pointer" onClick={() => setIsLoginPage(false)}>Sign Up</span>
          </p>
        ) : (
          <p>
            Already User?{" "}
            <span className="cursor-pointer" onClick={() => setIsLoginPage(true)}>Login Up</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
