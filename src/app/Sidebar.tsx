// components/Sidebar.tsx
import React from "react";
import Image from "next/image";
import { useRemoteUsers } from "agora-rtc-react";
interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const remoteUsers = useRemoteUsers();
  // const {data: session} = usesession();

  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-white  text-white p-4 overflow-y-scroll">
      <div className="flex justify-end">
        <button onClick={toggleSidebar} className="text-white p-2">
          ✕
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl mb-2 bg-[#242737] py-6 pl-4 rounded-2xl">
          Participants
        </h2>
        {remoteUsers?.map((user) => (
          <div key={user?.uid} className="flex items-center mb-2">
            <span className="flex-grow text-black ml-2">{user?.uid}</span>
            <Image
              src={user?.videoTrack ? "/cam-on.png" : "/cam-off.png"}
              alt=""
              width={40}
              height={40}
              className="mx-2"
            />
            <Image
              className="mx-2"
              src={user?.audioTrack ? "/mic-on.png" : "/mic-off.png"}
              alt=""
              width={40}
              height={40}
            />
          </div>
        ))}
      </div>
      {/* <div>
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
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          className="w-full p-2 bg-gray-900"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div> */}
    </div>
  );
};

export default Sidebar;
