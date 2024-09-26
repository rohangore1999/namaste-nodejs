import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requestData = useSelector((store) => store.request);

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/pending", {
        withCredentials: true,
      });

      dispatch(addRequest(res.data.data));
    } catch (error) {}
  };

  const handleRequest = async (status, requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(requestId))
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  return requestData?.length ? (
    <div className="text-center my-10">
      <h1 className="text-bold text-2xl">Request Pending</h1>

      {requestData.map((request) => (
        <div className="flex m-4 p-4 rounded-lg bg-base-300 justify-between">
          <div>
            <h2>
              {request.fromUserId.firstName + " " + request.fromUserId.lastName}
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-primary bg-red-500"
              onClick={() => handleRequest("rejected", request.fromUserId._id)}
            >
              Reject
            </button>

            <button
              className="btn btn-primary bg-green-500"
              onClick={() => handleRequest("accepted", request._id)}
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No Request found !!</p>
  );
};

export default Requests;
