import io from "socket.io-client";

// Creating a socket connection with the server
export const createSocketConnection = () => {
  const socket = io("http://localhost:7777", {
    transports: ["websocket"],
  });

  return socket;
};
