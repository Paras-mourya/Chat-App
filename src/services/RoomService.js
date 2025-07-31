import { httpClient } from "../config/AxiosHelper";

// Send roomId as plain string (with double quotes)
export const createRoom = async (roomDetail) => {
  const response = await httpClient.post(
    `/api/v1/rooms`,
    `"${roomDetail}"`, // 👈 send as raw JSON string
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};
