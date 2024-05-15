// components/PresenterScreen.tsx
import React from "react";

interface PresenterScreenProps {
  activeAttendee: string | null;
}

const PresenterScreen: React.FC<PresenterScreenProps> = ({
  activeAttendee,
}) => {
  return (
    <div className="flex-grow bg-gray-800">
      <div className="text-white p-4">
        {activeAttendee ? `Attendee: ${activeAttendee}` : "Presenter Screen"}
      </div>
    </div>
  );
};

export default PresenterScreen;
