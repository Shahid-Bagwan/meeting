// components/Sidebar.tsx
import React, { useState } from "react";
import { useRemoteUsers } from "agora-rtc-react";
interface SidebarProps {
  participants: Array<{ uid: string; cameraOn: boolean; micOn: boolean }>;
  chatMessages: Array<{ uid: string; message: string }>;
  onSendMessage: (message: string) => void;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  participants,
  chatMessages,
  // onSendMessage,
  toggleSidebar,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const remoteUsers = useRemoteUsers();
  // const {data: session} = usesession();
  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-gray-800 text-white p-4 overflow-y-scroll">
      <div className="flex justify-end">
        <button onClick={toggleSidebar} className="text-white p-2">
          ✕
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Participants</h2>
        {remoteUsers?.map((user) => (
          <div key={user?.uid} className="flex items-center mb-2">
            <span className="flex-grow">{user?.uid}</span>
            <span
              className={`mx-1 ${user?.videoTrack ? "bg-green-500" : "bg-red-500"}`}
            >
              📷
            </span>
            <span
              className={`mx-1 ${user?.audioTrack ? "bg-green-500" : "bg-red-500"}`}
            >
              🎤
            </span>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl mb-2">Chat</h2>
        <div
          className="flex-grow bg-gray-700 p-2 mb-2 overflow-y-scroll"
          style={{ height: "200px" }}
        >
          {chatMessages?.map((message, index) => (
            <div key={index} className="mb-2">
              {message.uid}: {message.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          className="w-full p-2 bg-gray-900"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="w-full p-2 bg-blue-500 mt-2">Send</button>
      </div>
    </div>
  );
};

export default Sidebar;
