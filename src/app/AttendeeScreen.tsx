// components/AttendeeScreen.tsx
// import React from "react";

// interface AttendeeScreenProps {
//   onAttendeeClick: (attendeeId: string) => void;
// }

// const attendees = [
//   { id: "attendee1", name: "Attendee 1" },
//   { id: "attendee2", name: "Attendee 2" },
//   { id: "attendee3", name: "Attendee 3" },
// ];

// const AttendeeScreen: React.FC<AttendeeScreenProps> = ({ onAttendeeClick }) => {
//   return (
//     <div className="w-full h-3/10 bg-gray-700 overflow-x-auto">
//       <div className="flex space-x-4 p-4">
//         {attendees.map((attendee) => (
//           <div
//             key={attendee.id}
//             className="relative flex-none w-40 h-40 bg-gray-800 text-white flex items-center justify-center cursor-pointer"
//             onClick={() => onAttendeeClick(attendee.id)}
//           >
//             <video
//               className="w-full h-full"
//               // Replace the src with the actual video source
//               src={`path/to/video/${attendee.id}.mp4`}
//               autoPlay
//               muted
//               loop
//             ></video>
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-1 text-xs">
//               {attendee.name}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AttendeeScreen;

import React, { useEffect, useState } from "react";
import { agoraService } from "./agoraService";
import { IRemoteVideoTrack } from "agora-rtc-sdk-ng";

interface AttendeeScreenProps {
  onAttendeeClick: (attendeeId: string) => void;
}

const AttendeeScreen: React.FC<AttendeeScreenProps> = ({ onAttendeeClick }) => {
  const [attendees, setAttendees] = useState<
    { id: string; videoTrack: IRemoteVideoTrack }[]
  >([]);

  useEffect(() => {
    const handleUserPublished = async (user: any, mediaType: any) => {
      await agoraService.client.subscribe(user, mediaType);
      if (mediaType === "video") {
        setAttendees((prev) => [
          ...prev,
          { id: user.uid, videoTrack: user.videoTrack },
        ]);
      }
    };

    agoraService.client.on("user-published", handleUserPublished);
    return () => {
      agoraService.client.off("user-published", handleUserPublished);
    };
  }, []);

  return (
    <div className="w-full h-3/10 bg-gray-700 overflow-x-auto">
      <div className="flex space-x-4 p-4">
        {attendees.map((attendee) => (
          <div
            key={attendee.id}
            className="relative flex-none w-40 h-40 bg-gray-800 text-white flex items-center justify-center cursor-pointer"
            onClick={() => onAttendeeClick(attendee.id)}
          >
            <video
              ref={(video) => video! && attendee.videoTrack?.play(video)}
              className="w-full h-full"
              autoPlay
              muted
            ></video>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-1 text-xs">
              {attendee.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeScreen;
