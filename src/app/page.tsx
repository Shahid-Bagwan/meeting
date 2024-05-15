"use client";
// import dynamic from "next/dynamic";
import PresenterScreen from "./PresenterScreen";
import AttendeeScreen from "./AttendeeScreen";
import Controls from "./Controls";
import Sidebar from "./Sidebar";
// const Meeting = dynamic(() => import("./Meeting"), { ssr: false });

import React, { useState } from "react";
const Page = () => {
  const [activeAttendee, setActiveAttendee] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAttendeeClick = (attendeeId: string) => {
    setActiveAttendee(attendeeId);
  };

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
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
    </div>
  );
};

export default Page;
