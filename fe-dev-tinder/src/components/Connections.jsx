import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();

  const connectionsData = useSelector((store) => store.connection);

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/accepted", {
        withCredentials: true,
      });

      dispatch(addConnection(res.data.data));
    } catch (error) {}
  };

  useEffect(() => {
    getConnections();
  }, []);

  return connectionsData && (
    <div className="text-center my-10">
      <h1 className="text-bold text-2xl">Connections</h1>

      {connectionsData.map((connection) => (
        <div className="flex m-4 p-4 rounded-lg bg-base-300">
          <div>
            <h2>{connection.firstName + " " + connection.lastName}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Connections;
