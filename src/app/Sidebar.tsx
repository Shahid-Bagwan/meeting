// components/Sidebar.tsx
import React from "react";

interface SidebarProps {
  toggleSidebar: () => void;
}

const participants = [
  { name: "Dianne Russell", cameraOn: true, micOn: true },
  { name: "Guy Hawkins", cameraOn: false, micOn: false },
  { name: "Kathryn Murphy", cameraOn: true, micOn: false },
];

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-gray-800 text-white p-4 overflow-y-scroll">
      <div className="flex justify-end md:hidden">
        <button onClick={toggleSidebar} className="text-white p-2">
          ✕
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Participants</h2>
        {participants.map((participant) => (
          <div key={participant.name} className="flex items-center mb-2">
            <span className="flex-grow">{participant.name}</span>
            <span
              className={`mx-1 ${participant.cameraOn ? "text-green-500" : "text-red-500"}`}
            >
              📷
            </span>
            <span
              className={`mx-1 ${participant.micOn ? "text-green-500" : "text-red-500"}`}
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
          <div className="mb-2">Kathryn: Hello!</div>
          <div className="mb-2">Joshua: Hi there!</div>
        </div>
        <input
          type="text"
          className="w-full p-2 bg-gray-900"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default Sidebar;
