import React, { useState } from "react";
import Cards from "./Cards";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ data }) => {
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setlastName] = useState(data.lastName);

  const dispatch = useDispatch();

  const handleSaveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName },
        { withCredentials: true }
      );

      // saving updated profile
      dispatch(addUser(res?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center gap-5 mt-5">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mx-auto">Edit Profile</h2>

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

            <div className="space-y-2">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="input w-full max-w-xs"
              />
            </div>
          </div>

          {/* {errMsg && <p className="text-red-500">{errMsg}</p>} */}

          <div className="card-actions justify-center mt-2">
            <button className="btn btn-primary" onClick={handleSaveProfile}>
              Save Profile
            </button>
          </div>
        </div>
      </div>

      <Cards data={{ firstName, lastName }} />
    </div>
  );
};

export default EditProfile;
