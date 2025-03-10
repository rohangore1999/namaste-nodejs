import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const userData = useSelector((store) => store.user);

  return (
    <div>
      {userData && <EditProfile data={userData} />}

      <button className="btn btn-primary bg-red-500">Interested</button>
    </div>
  );
};

export default Profile;
