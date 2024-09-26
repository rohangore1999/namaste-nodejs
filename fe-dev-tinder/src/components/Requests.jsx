import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requestData = useSelector(store => store.request)

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/pending", {
        withCredentials: true,
      });

      dispatch(addRequest(res.data.data));
    } catch (error) {}
  };

  useEffect(()=>{
    fetchRequest()
  },[])

  console.log({requestData})

  return <div>Requests</div>;
};

export default Requests;
