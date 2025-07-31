import React, { useEffect, useRef, useState } from "react";
import { MdSend, MdAttachFile } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import { baseURL } from "../config/AxiosHelper";
import toast from "react-hot-toast";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatPage = () => {
  const { roomId, currentUser, connected } = useChatContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // Navigate back if not connected
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  // Fetch old messages
  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${baseURL}/api/v1/rooms/${roomId}/messages?page=0&size=50`
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to fetch messages");
      }

      const data = await res.json();
      setMessages(data);

      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      toast.error(`Message load failed: ${err.message}`);
    }
  };

  if (roomId) {
    fetchMessages();
  }
}, [roomId]);


  // Setup STOMP client
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseURL}/chat`),
      onConnect: () => {
        setStompClient(client);
        toast.success("Connected to chat");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);

          // Scroll to bottom
          setTimeout(() => {
            if (chatBoxRef.current) {
              chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
          }, 100);
        });
      },
      onStompError: (frame) => {
        toast.error("STOMP error: " + frame.headers.message);
      },
    });

    client.activate();

    return () => {
      client.deactivate(); // Cleanup
    };
  }, [roomId]);

  const leave=()=>{
    navigate("/");
  }
  // Send message
  const sendMessage = () => {
    if (input.trim() === "") return;
    console.log(input);
    const messageObj = {
      content: input,
      sender: currentUser,
      roomId: roomId,
    };

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(messageObj),
      });
      setInput("");
      inputRef.current?.focus();
    } else {
      toast.error("Not connected to server");
    }
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md fixed top-0 w-full z-10 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-green-900">
        <div className="text-xl font-semibold">
          Room: <span className="font-normal">{roomId}</span>
        </div>
        <div className="text-xl font-semibold">
          User: <span className="font-normal">{currentUser}</span>
        </div>
        <button onClick={leave} className="bg-green-500 hover:bg-green-700 transition-all duration-200 text-white rounded-lg px-5 py-2 text-base font-medium">
          Leave Room
        </button>
      </header>

      {/* Chat Messages Area */}
      <main
        ref={chatBoxRef}
        className="py-24 px-4 w-full md:w-2/3 dark:bg-gray-800 mx-auto h-[calc(100vh-8rem)] overflow-y-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-3 p-4 rounded-2xl shadow-md max-w-md w-fit transition-all duration-300 ${
                message.sender === currentUser
                  ? "bg-green-700 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <img
                className="h-10 w-10 rounded-full border border-green-300"
                src={`https://avatar.iran.liara.run/public/${index + 1}`}
                alt=""
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold">{message.sender}</p>
                <p className="text-base leading-snug">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full px-4 pb-4">
        <div className="flex items-center w-full max-w-3xl mx-auto bg-gray-800 border border-green-500 rounded-full px-4 py-2 shadow-lg">
          {/* Attach File Icon */}
          <button
            className="text-green-400 hover:text-green-600 text-2xl mr-2 transition-transform hover:scale-110"
            title="Attach file"
          >
            <MdAttachFile />
          </button>

          {/* Message Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent text-white text-lg outline-none px-2 focus:ring-0 placeholder-gray-400"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className="ml-3 text-green-400 hover:text-green-600 text-3xl transition-transform hover:scale-110"
            title="Send message"
          >
            <MdSend />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
