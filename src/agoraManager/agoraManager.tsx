// Import necessary components and hooks from Agora SDK and React
import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
  useClientEvent,
} from "agora-rtc-react";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import AgoraRTC, {
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";
import { configType } from "./config";

// Define the shape of the Agora context
interface AgoraContextType {
  localCameraTrack: ICameraVideoTrack | null;
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
  children: React.ReactNode;
}

// Create the Agora context
const AgoraContext = createContext<AgoraContextType | null>(null);

// AgoraProvider component to provide the Agora context to its children
export const AgoraProvider: React.FC<AgoraContextType> = ({
  children,
  localCameraTrack,
  localMicrophoneTrack,
}) => (
  <AgoraContext.Provider
    value={{ localCameraTrack, localMicrophoneTrack, children }}
  >
    {children}
  </AgoraContext.Provider>
);

// Custom hook to access the Agora context
export const useAgoraContext = () => {
  const context = useContext(AgoraContext);
  if (!context)
    throw new Error("useAgoraContext must be used within an AgoraProvider");
  return context;
};

// AgoraManager component responsible for handling Agora-related logic and rendering UI
export const AgoraManager = ({
  config,
  children,
}: {
  config: configType;
  children: React.ReactNode;
}) => {
  const agoraEngine = useRTCClient();
  // Retrieve local camera and microphone tracks and remote users
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const [role, setRole] = useState("host"); // Default role is host
  // Add state variables to keep track of camera and microphone status
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(true);

  const screenShareClient = useRef(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState<ICameraVideoTrack | null>(
    null
  );
  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Join the Agora channel with the specified configuration
  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
    uid: config.uid,
  });

  useClientEvent(agoraEngine, "user-joined", (user) => {
    console.log("The user", user.uid, " has joined the channel");
  });

  useClientEvent(agoraEngine, "user-left", (user) => {
    console.log("The user", user.uid, " has left the channel");
  });

  useClientEvent(agoraEngine, "user-published", (user, mediaType) => {
    console.log("The user", user.uid, " has published media in the channel");
  });

  useEffect(() => {
    return () => {
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
      if (screenTrack) {
        screenTrack.close();
      }
      screenShareClient.current.leave();
    };
  }, []);
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
  // Check if devices are still loading
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  // Render the AgoraProvider and associated UI components
  return (
    <AgoraProvider
      localCameraTrack={localCameraTrack}
      localMicrophoneTrack={localMicrophoneTrack}
    >
      {children}

      <div>
        <button onClick={handleToggleCamera}>
          {isCameraActive ? "Stop Camera" : "Start Camera"}
        </button>
        <button onClick={handleToggleMicrophone}>
          {isMicrophoneActive ? "Stop Microphone" : "Start Microphone"}
        </button>
        <button onClick={handleToggleScreenSharing}>
          {isScreenSharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
        </button>
      </div>
      <div id="videos">
        {/* Render the local video track */}
        <div className="vid" style={{ height: 300, width: 600 }}>
          <LocalVideoTrack track={localCameraTrack} play={true} />
        </div>
        {/* Render remote users' video and audio tracks */}
        {remoteUsers.map((remoteUser) => (
          <div
            className="vid"
            style={{ height: 300, width: 600 }}
            key={remoteUser.uid}
          >
            <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
          </div>
        ))}
      </div>
    </AgoraProvider>
  );
};

// Export the AgoraManager component as the default export
export default AgoraManager;
