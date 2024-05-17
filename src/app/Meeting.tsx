"use client";
// import dynamic from "next/dynamic";
import PresenterScreen from "./PresenterScreen";
import AttendeeScreen from "./AttendeeScreen";
import Controls from "./Controls";
import Sidebar from "./Sidebar";
// const Meeting = dynamic(() => import("./Meeting"), { ssr: false });
import { agoraService } from "./agoraService";
import { UID } from "agora-rtc-sdk-ng";
import React, { useState, useEffect } from "react";
const Meeting = () => {
  // const [activeAttendee, setActiveAttendee] = useState<string | null>(null);
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const handleAttendeeClick = (attendeeId: string) => {
  //   setActiveAttendee(attendeeId);
  // };

  // const toggleSidebar = () => {
  //   console.log("toggleSidebar");
  //   setSidebarOpen(!sidebarOpen);
  // };

  // return (
  //   <div className="flex flex-col h-screen">
  //     <div className="h-1/2 bg-gray-800">
  //       <PresenterScreen activeAttendee={activeAttendee} />
  //     </div>
  //     <div className="h-3/10 bg-gray-700 overflow-hidden">
  //       <AttendeeScreen onAttendeeClick={handleAttendeeClick} />
  //     </div>
  //     <div className="h-1/5 bg-gray-900">
  //       <Controls toggleSidebar={toggleSidebar} />
  //     </div>
  //     {sidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
  //   </div>
  // );
  const [activeAttendee, setActiveAttendee] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const initializeAgora = async () => {
      try {
        const channel = "main";
        const appId: string = "44ac98e9fc0c42e2bcfa9546ff2766d8"; // Replace with your Agora App ID
        const token: string | null =
          "007eJxTYJh0PFhVI27mmiT76Nnz+PLyFwiLzM4wnS99syPV6NTF8g8KDCYmicmWFqmWackGySZGqUZJyWmJlqYmZmlpRuZmZikWC9a6pjUEMjJsYvvIyMgAgSA+C0NuYmYeAwMA9/8e2A=="; // Replace with your token if you have enabled token security
        const uid: UID | null = null;
        if (isMounted) {
          // await agoraService.initialize(appId);
          await agoraService.joinChannel(appId, channel, token, uid);
          await agoraService.createLocalTracks();
          await agoraService.publishLocalTracks();
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error initializing Agora:", error);
        }
      }
    };

    initializeAgora();

    return () => {
      isMounted = false;
      agoraService.leaveChannel();
    };
  }, []);
  const handleAttendeeClick = (attendeeId: string) => {
    if (activeAttendee === attendeeId) {
      setActiveAttendee(null); // Revert back to local video if the same attendee is clicked again
    } else {
      setActiveAttendee(attendeeId); // Switch to the clicked attendee's video
    }
  };

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen relative">
      <div className="h-1/2 bg-gray-800">
        <PresenterScreen activeAttendee={activeAttendee} />
      </div>
      <div className="h-3/10 bg-gray-700 overflow-hidden">
        <AttendeeScreen onAttendeeClick={handleAttendeeClick} />
      </div>
      <div className="h-1/5 bg-gray-900">
        <Controls toggleSidebar={toggleSidebar} />
      </div>
      {sidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
      <div className="absolute top-0 left-0 p-2 text-white">
        Welcome, shahid
      </div>
    </div>
  );
};

export default Meeting;
