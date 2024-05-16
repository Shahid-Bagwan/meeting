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
      if (videoRef.current && agoraService.localVideoTrack) {
        agoraService.localVideoTrack.play(videoRef.current);
      }
    };

    setupVideo();
  }, [activeAttendee]);

  return (
    <div className="flex-grow bg-gray-800">
      <video
        ref={videoRef}
        className="text-white p-4 w-full h-full"
        autoPlay
        muted
      />
    </div>
  );
};
export default PresenterScreen;
