import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import Cards from "./Cards";

const Feeds = () => {
  const dispatch = useDispatch();

  const feedData = useSelector((store) => store.feed);

  const getFeeds = async () => {
    try {
      if (!feedData) {
        const res = await axios.get(BASE_URL + "/feeds", {
          withCredentials: true,
        });

        dispatch(addFeed(res.data));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getFeeds();
  }, []);

  return feedData?.length ? (
    <div className="flex justify-center mt-10">
      {/* We just want to show one card and as we "interested | ignored" we are removing the user */}
      <Cards data={feedData[0]} />
    </div>
  ) : (
    <>No Pending Request!!!</>
  );
};

export default Feeds;
