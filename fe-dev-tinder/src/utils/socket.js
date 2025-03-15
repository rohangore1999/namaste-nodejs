import io from "socket.io-client";

// Constants
import { BASE_URL } from "./constants";

// Creating a socket connection with the server
export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    const socket = io(BASE_URL);

    return socket;
  } else {
    return io("/", { path: "/api/socket.io" }); // for prod; devTinder.com/api/socket.io <--- this is the path
  }
};
