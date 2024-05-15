// components/Controls.tsx
import React, { useState } from "react";

interface ControlsProps {
  toggleSidebar: () => void;
}

const Controls: React.FC<ControlsProps> = ({ toggleSidebar }) => {
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenShareOn, setScreenShareOn] = useState(false);

  return (
    <div className="flex justify-center p-4 bg-gray-900">
      <button
        className={`mx-2 ${cameraOn ? "text-green-500" : "text-red-500"}`}
        onClick={() => setCameraOn(!cameraOn)}
      >
        Camera
      </button>
      <button
        className={`mx-2 ${micOn ? "text-green-500" : "text-red-500"}`}
        onClick={() => setMicOn(!micOn)}
      >
        Mic
      </button>
      <button
        className={`mx-2 ${screenShareOn ? "text-green-500" : "text-red-500"}`}
        onClick={() => setScreenShareOn(!screenShareOn)}
      >
        Share
      </button>
      <button className="mx-2 text-white">End Call</button>
      <button className="mx-2 text-white" onClick={toggleSidebar}>
        Chat
      </button>
    </div>
  );
};

export default Controls;
