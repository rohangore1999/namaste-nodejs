import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
    const dispatch = useDispatch()
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/accepted", {
        withCredentials: true,
      });

      dispatch(addConnection(res.data.data))
    } catch (error) {}
  };

  useEffect(() => {
    getConnections();
  }, []);

  return <div>Connections</div>;
};

export default Connections;
