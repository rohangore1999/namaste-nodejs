import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const userData = useSelector(store => store.user)

  return (
    <div>
      {userData && <EditProfile data={userData}/>}
    </div>
  );
};

export default Profile;
