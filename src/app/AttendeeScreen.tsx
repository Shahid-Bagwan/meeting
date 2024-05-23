import React from "react";
import { LocalVideoTrack, RemoteUser, useRemoteUsers } from "agora-rtc-react";

interface AttendeeScreenProps {
  onAttendeeClick: (attendeeId: string) => void;
}

const AttendeeScreen: React.FC<AttendeeScreenProps> = ({
  onAttendeeClick,
  activeStream,
  localCameraTrack,
}) => {
  const remoteUsers = useRemoteUsers();

  return (
    <div className="w-full h-3/10  overflow-x-auto">
      <div className="flex space-x-4 p-4">
        {remoteUsers.map((remoteUser) => (
          <div
            key={remoteUser.uid}
            className="relative flex-none w-40 h-40  text-white flex items-center justify-center cursor-pointer "
            onClick={() => onAttendeeClick(remoteUser.uid)}
          >
            {activeStream === remoteUser.uid ? (
              <LocalVideoTrack
                track={localCameraTrack}
                play={true}
                className=""
                style={{ borderRadius: "10%" }}
              />
            ) : (
              <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-1 text-xs">
              {remoteUser.uid}
            </div>
          </div>
        ))}
        {/* {remoteUsers.map((remoteUser) => (
          <div className="vid" style={{ height: 300, width: 600 }} key={remoteUser.uid}>
            <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default AttendeeScreen;
