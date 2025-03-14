import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Slice
import { addConnection } from "../utils/connectionSlice";

// Constants
import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const dispatch = useDispatch();

  const connectionsData = useSelector((store) => store.connection);
  const navigate = useNavigate();

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/accepted", {
        withCredentials: true,
      });

      dispatch(addConnection(res.data.data));
    } catch (error) {}
  };

  const handleNavigateToChat = (connection) => {
    navigate(`/chat/${connection?._id}`);
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    connectionsData && (
      <div className="text-center my-10">
        <h1 className="text-bold text-2xl">Connections</h1>

        {connectionsData.map((connection) => (
          <div
            className="flex m-4 p-4 rounded-lg bg-base-300 cursor-pointer"
            onClick={() => handleNavigateToChat(connection)}
          >
            <div>
              <h2>{connection.firstName + " " + connection.lastName}</h2>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default Connections;
