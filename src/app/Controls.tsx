import React, { useState, useRef, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import config from "../agoraManager/config";
interface ControlsProps {
  toggleSidebar: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  toggleSidebar,
  localCameraTrack,
  localMicrophoneTrack,
  leaveChannel,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(true);

  const screenShareClient = useRef(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState<ICameraVideoTrack | null>(
    null
  );
  const handleToggleCamera = () => {
    if (localCameraTrack) {
      void localCameraTrack.setEnabled(!isCameraActive);
      setIsCameraActive(!isCameraActive);
    }
  };

  // Function to handle toggling the microphone
  const handleToggleMicrophone = () => {
    if (localMicrophoneTrack) {
      void localMicrophoneTrack.setEnabled(!isMicrophoneActive);
      setIsMicrophoneActive(!isMicrophoneActive);
    }
  };

  // Function to handle toggling screen sharing
  const handleToggleScreenSharing = async () => {
    if (!isScreenSharing) {
      try {
        // Create and publish the screen track with the screenShareClient
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: "1080p",
        });
        await screenShareClient.current.join(
          config.appId,
          config.channelName,
          config.rtcToken,
          null
        );
        await screenShareClient.current.publish(screenTrack);
        setScreenTrack(screenTrack);
        setIsScreenSharing(true);
        console.log("Screen sharing started");
      } catch (error) {
        console.error("Error starting screen sharing:", error);
      }
    } else {
      try {
        // Stop the screen track and leave the screenShareClient
        if (screenTrack) {
          await screenShareClient.current.unpublish(screenTrack);
          screenTrack.close();
          setScreenTrack(null);
        }
        await screenShareClient.current.leave();
        setIsScreenSharing(false);
        console.log("Screen sharing stopped");
      } catch (error) {
        console.error("Error stopping screen sharing:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (screenTrack) {
        screenTrack.close();
      }
      screenShareClient.current.leave();
    };
  }, []);
  return (
    <div className="flex justify-center p-4 bg-gray-900">
      <button
        className={`mx-2 ${isCameraActive ? "text-green-500" : "text-red-500"}`}
        onClick={handleToggleCamera}
      >
        Camera
      </button>
      <button
        className={`mx-2 ${isMicrophoneActive ? "text-green-500" : "text-red-500"}`}
        onClick={handleToggleMicrophone}
      >
        Mic
      </button>
      <button
        className={`mx-2 ${isScreenSharing ? "text-green-500" : "text-red-500"}`}
        onClick={handleToggleScreenSharing}
      >
        {isScreenSharing ? "Stop Sharing" : "Share Screen"}
      </button>
      <button className="mx-2 text-white" onClick={leaveChannel}>
        End Call
      </button>
      <button className="mx-2 text-white" onClick={toggleSidebar}>
        Chat
      </button>
    </div>
  );
};

export default Controls;
