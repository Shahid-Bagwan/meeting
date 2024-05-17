// // components/PresenterScreen.tsx
// import React from "react";

// interface PresenterScreenProps {
//   activeAttendee: string | null;
// }

// const PresenterScreen: React.FC<PresenterScreenProps> = ({
//   activeAttendee,
// }) => {
//   return (
//     <div className="flex-grow bg-gray-800">
//       <div className="text-white p-4">
//         {activeAttendee ? `Attendee: ${activeAttendee}` : "Presenter Screen"}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useRef } from "react";
import { agoraService } from "./agoraService";

interface PresenterScreenProps {
  activeAttendee: string | null;
}

const PresenterScreen: React.FC<PresenterScreenProps> = ({
  activeAttendee,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupVideo = async () => {
      if (videoRef.current) {
        console.log(
          "Setting up video element for attendee:",
          agoraService.localVideoTrack
        );
        if (activeAttendee) {
          console.log(
            "Playing remote video track for attendee:",
            activeAttendee
          );
          const attendeeVideoTrack =
            agoraService.remoteUsers[activeAttendee].videoTrack;
          if (attendeeVideoTrack) {
            attendeeVideoTrack.play(videoRef.current);
          } else {
            videoRef.current.srcObject = null; // Clear the video element if no video track
          }
        } else if (agoraService.localVideoTrack) {
          console.log("Playing local video track");
          agoraService.localVideoTrack.play(videoRef.current);
        }
      }
    };

    setupVideo();
  }, [activeAttendee]);

  return (
    <div className="flex-grow bg-gray-800">
      <video ref={videoRef} className="text-white p-4 " autoPlay playsInline />
    </div>
  );
};
export default PresenterScreen;
