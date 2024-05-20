import React, { useEffect, useRef } from "react";
import { LocalVideoTrack } from "agora-rtc-react";
interface PresenterScreenProps {
  activeAttendee: string | null;
}

const PresenterScreen: React.FC<PresenterScreenProps> = ({
  activeAttendee,
  localCameraTrack,
  localMicrophoneTrack,
}) => {
  console.log("localCameraTrack", localCameraTrack);
  return (
    <div className="flex-grow bg-gray-800">
      hey there
      {/* <LocalVideoTrack track={localCameraTrack} play={true} /> */}
    </div>
  );
};
export default PresenterScreen;
