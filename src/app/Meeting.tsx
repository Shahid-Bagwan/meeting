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
  const [activeAttendee, setActiveAttendee] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAttendeeClick = (attendeeId: string) => {
    setActiveAttendee((prev) => (prev === attendeeId ? null : attendeeId));
  };

  const toggleSidebar = () => {
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
