import io from "socket.io-client";

// Constants
import { BASE_URL } from "./constants";

// Creating a socket connection with the server
export const createSocketConnection = io(BASE_URL);
