import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";
import axios from "axios";

const Cards = ({ data }) => {
  const { firstName, lastName } = data;

  const dispatch = useDispatch();

  const handleConnectionRequest = async (status, id) => {
    console.log({ status, id });
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + id,
        {},
        { withCredentials: true }
      );

      //removing that user card from the feed data
      dispatch(removeFeed(id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>

        <div className="card-actions justify-end gap-2">
          <button
            className="btn btn-primary bg-gray-500"
            onClick={() => handleConnectionRequest("ignored", data._id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-primary bg-pink-500"
            onClick={() => handleConnectionRequest("interested", data._id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
