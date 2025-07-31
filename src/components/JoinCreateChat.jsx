import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoom as createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const {
    roomId,
    setRoomId,
    currentUser,
    setCurrentUser,
    connected,
    setConnected
  } = useChatContext();

  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid input");
      return false;
    }
    return true;
  }

 async function joinChat() {
    if (validateForm()) {
    try {
       const room= await joinChatApi(detail.roomId);
     toast.success("joined");
      setCurrentUser(detail.userName);
      setRoomId(detail.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if(error.status==400){
        toast.error(error.response.data);
            }
    else{
        toast.error("error in joining room");
    }
      console.log(error);
    }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi(detail.roomId);
        toast.success("Room created successfully");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error("Room ID already exists");
        } else {
          toast.error("Error creating room");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="border p-10 flex flex-col gap-6 w-full max-w-2xl rounded-xl dark:bg-gray-500">
        <h1 className="text-3xl font-bold text-center">Join Room / Create Room</h1>

        {/* User Name */}
        <div>
          <label className="block font-medium mb-2 text-lg">Your Name</label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            name="userName"
            type="text"
            placeholder="Enter name"
            className="w-full dark:bg-gray-600 px-5 py-3 text-lg border dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:green-600"
          />
        </div>

        {/* Room ID */}
        <div>
          <label className="block font-medium mb-2 text-lg">Room ID / New Room ID</label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomId}
            name="roomId"
            type="text"
            placeholder="Enter room ID"
            className="w-full dark:bg-gray-600 px-5 py-3 text-lg border dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:green-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-8 pt-2">
          <button
            onClick={joinChat}
            className="px-8 py-3 text-lg dark:bg-green-600 rounded-lg hover:dark:bg-green-900"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="px-8 py-3 text-lg dark:bg-orange-500 rounded-lg hover:dark:bg-orange-900"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
