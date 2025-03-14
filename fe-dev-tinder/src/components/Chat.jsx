import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, sender: "receiver", text: "It's over Anakin," },
    { id: 2, sender: "user", text: "You underestimate my power!" },
    { id: 3, sender: "receiver", text: "Don't try it!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex justify-center h-screen bg-gray-900 p-5">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl flex flex-col h-[80vh] border border-gray-700">
        {/* Chat header */}
        <div className="bg-gray-900 text-white p-4 rounded-t-lg flex items-center border-b border-gray-700">
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold mr-3">
            {targetUserId?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="font-bold text-lg">Chat with {targetUserId || "User"}</h2>
            <p className="text-xs text-purple-400">Online</p>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat ${message.sender === "user" ? "chat-end" : "chat-start"} mb-4`}
            >
              <div
                className={`chat-bubble ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-200"
                } shadow-md`}
              >
                {message.text}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-right" : "text-left"
                } text-gray-400`}
              >
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-gray-700 bg-gray-900 rounded-b-lg"
        >
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 rounded-l-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />

            <button
              type="submit"
              className="bg-purple-600 text-white p-3 rounded-r-full hover:bg-purple-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
