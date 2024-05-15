"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  UID,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";

const Meeting: React.FC = () => {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [videoActive, setVideoActive] = useState(true); // State to manage video track activity
  const [audioActive, setAudioActive] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = initClient;
      const joinRoom = async () => {
        try {
          const APP_ID: string = "44ac98e9fc0c42e2bcfa9546ff2766d8"; // Replace with your Agora App ID
          const TOKEN: string | null =
            "007eJxTYEj73PRznsoWAcHl74/tbjslv3vXu8/C1xUnWs26fFxk2dctCgwmJonJlhaplmnJBskmRqlGSclpiZamJmZpaUbmZmYpFvvmu6Q1BDIyNE1+x8AIhSA+C0NuYmYeAwMAbh8jhQ=="; // Replace with your token if you have enabled token security
          const UID: UID | null = null; // Set UID or null to let Agora assign one

          await clientRef.current?.join(APP_ID, "main", TOKEN, UID);

          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          const videoTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalAudioTrack(audioTrack);
          setLocalVideoTrack(videoTrack);
          // Ensure only one instance of the video track is played
          const localContainer = document.getElementById("local-container");
          if (localContainer) {
            localContainer.innerHTML = ""; // Clear any existing video elements
          }
          videoTrack.play("local-container");
          await clientRef.current?.publish([audioTrack, videoTrack]);

          clientRef.current?.on("user-published", async (user, mediaType) => {
            await clientRef.current?.subscribe(user, mediaType);
            // Update remote users state
            setRemoteUsers((prevUsers) => {
              const newUsers = [...prevUsers];
              const index = newUsers.findIndex((u) => u.uid === user.uid);
              if (index === -1) {
                newUsers.push(user);
              }
              return newUsers;
            });
            console.log("remoteUsers", remoteUsers);
            if (mediaType === "video") {
              const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
              let playerContainer = document.getElementById(
                user.uid.toString()
              );
              if (!playerContainer) {
                playerContainer = document.createElement("div");
                playerContainer.id = user.uid.toString();
                playerContainer.style.width = "320px";
                playerContainer.style.height = "240px";
                document
                  .getElementById("remote-container")
                  ?.appendChild(playerContainer);
              } else {
                // Clear any existing video elements in the container
                playerContainer.innerHTML = "";
              }
              remoteVideoTrack.play(playerContainer);
            }

            if (mediaType === "audio") {
              user.audioTrack?.play();
            }
          });

          clientRef.current?.on("user-unpublished", (user) => {
            // Remove user from remote users state
            setRemoteUsers((prevUsers) =>
              prevUsers.filter((u) => u.uid !== user.uid)
            );
          });

          clientRef.current?.on("user-left", (user) => {
            setRemoteUsers((prevUsers) =>
              prevUsers.filter((u) => u.uid !== user.uid)
            );
          });
        } catch (error) {
          console.log("error", error);
        }
      };

      joinRoom();

      return () => {
        localAudioTrack?.stop();
        localAudioTrack?.close();
        localVideoTrack?.stop();
        localVideoTrack?.close();
        clientRef.current?.leave();
        clientRef.current = null;
      };
    }
  }, [clientRef]);
  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (videoActive) {
        // Stop the video track and unpublish it
        localVideoTrack.stop();
        await clientRef.current?.unpublish(localVideoTrack);
      } else {
        // Restart the video track and publish it again
        await clientRef.current?.publish(localVideoTrack);
        localVideoTrack.play("local-container");
      }
      setVideoActive(!videoActive); // Toggle the state
    }
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.setMuted(!audioActive); // Simply toggle the muted state.
      setAudioActive(!audioActive); // Update state to reflect change.
    }
  };

  console.log("remoteUsers", remoteUsers);
  return (
    <div>
      <div
        id="local-container"
        style={{ width: "320px", height: "240px" }}
      ></div>
      <button onClick={toggleVideo}>Toggle Video</button>
      <button onClick={toggleAudio}>Toggle Audio</button>
      <div id="remote-container">
        {remoteUsers?.map((user) => {
          // Check if the div already exists
          const playerContainer = document.getElementById(user.uid.toString());
          if (!playerContainer) {
            return (
              <div
                key={user.uid}
                id={user.uid.toString()}
                style={{
                  width: "320px",
                  height: "240px",
                  backgroundColor: "blue",
                }}
              >
                {/* The video will be rendered here */}
              </div>
            );
          }
          return null; // Don't create a new div if it already exists
        })}
      </div>
    </div>
  );
};

export default Meeting;
