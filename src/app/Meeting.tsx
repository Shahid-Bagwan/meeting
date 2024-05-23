"use client";
// import dynamic from "next/dynamic";
import AttendeeScreen from "./AttendeeScreen";
import Controls from "./Controls";
import Sidebar from "./Sidebar";
// const Meeting = dynamic(() => import("./Meeting"), { ssr: false });
import React, { createContext, useContext, useState, useEffect } from "react";

import {
  AgoraRTCProvider,
  useRTCClient,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useClientEvent,
} from "agora-rtc-react";
import AgoraRTC, {
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";
import { AgoraManager } from "../agoraManager/agoraManager";
import config from "../agoraManager/config";

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
const Meeting = ({
  config,
  children,
}: {
  config: configType;
  children: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // webrtc code
  const agoraEngine = useRTCClient();
  // Retrieve local camera and microphone tracks and remote users
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();

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
      // if (screenTrack) {
      //   screenTrack.close();
      // }
      // screenShareClient.current.leave();
    };
  }, []);

  const leaveChannel = async () => {
    await agoraEngine.leave();
    localCameraTrack?.close();
    localMicrophoneTrack?.close();
  };

  const [activeStream, setActiveStream] = useState<string | null>(null);
  const [localStreamInPresenter, setLocalStreamInPresenter] =
    useState<boolean>(true);

  const handleStreamToggle = (streamId: string) => {
    if (activeStream === streamId) {
      setActiveStream(null);
      setLocalStreamInPresenter(true);
    } else {
      setActiveStream(streamId);
      setLocalStreamInPresenter(false);
    }
  };
  return (
    <AgoraRTCProvider client={agoraEngine}>
      <AgoraProvider
        localCameraTrack={localCameraTrack}
        localMicrophoneTrack={localMicrophoneTrack}
      >
        {children}
        <div className="flex flex-col h-screen relative p-6">
          <div className="h-[58%] ">
            {localStreamInPresenter ? (
              <LocalVideoTrack track={localCameraTrack} play={true} />
            ) : (
              <RemoteUser
                user={remoteUsers?.find((user) => user.uid === activeStream)}
                playVideo={true}
                playAudio={true}
              />
            )}
          </div>
          <div className="h-[35%] overflow-hidden">
            <AttendeeScreen
              onAttendeeClick={handleStreamToggle}
              activeStream={activeStream}
              localCameraTrack={localCameraTrack}
            />
          </div>
          <div className="h-[7%] ">
            <Controls
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              localCameraTrack={localCameraTrack}
              localMicrophoneTrack={localMicrophoneTrack}
              leaveChannel={leaveChannel}
            />
          </div>
          {sidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
          <div className="absolute top-0 left-0 p-2 text-white">
            Welcome, shahid
          </div>
        </div>
      </AgoraProvider>
      {/* <AgoraManager config={config}></AgoraManager> */}
    </AgoraRTCProvider>
  );
};

const Main = () => {
  const agoraEngine = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct })
  );

  return (
    <div>
      <AgoraRTCProvider client={agoraEngine}>
        <Meeting config={config}></Meeting>
      </AgoraRTCProvider>
    </div>
  );
};

export default Main;
