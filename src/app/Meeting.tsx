"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
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
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
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
      setClient(initClient);
      const joinRoom = async () => {
        try {
          const APP_ID: string = "44ac98e9fc0c42e2bcfa9546ff2766d8"; // Replace with your Agora App ID
          const TOKEN: string | null =
            "007eJxTYBDeeDJ4Vr60jp2s+aR/ryf3iUxhy5um88hGLeU3Q2uDbZcCg4lJYrKlRaplWrJBsolRqlFSclqipamJWVqakbmZWYpFOpNzWkMgI4PlemtWRgYIBPFZGHITM/MYGACgFBys"; // Replace with your token if you have enabled token security
          const UID: UID | null = null; // Set UID or null to let Agora assign one

          await client?.join(APP_ID, "main", TOKEN, UID);

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
          await client?.publish([audioTrack, videoTrack]);

          client?.on("user-published", async (user, mediaType) => {
            await client?.subscribe(user, mediaType);
            // Update remote users state
            setRemoteUsers((prevUsers) => {
              const newUsers = [...prevUsers];
              const index = newUsers.findIndex((u) => u.uid === user.uid);
              if (index === -1) {
                newUsers.push(user);
              }
              return newUsers;
            });

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
              }
              remoteVideoTrack.play(playerContainer);
            }

            if (mediaType === "audio") {
              user.audioTrack?.play();
            }
          });

          client?.on("user-unpublished", (user) => {
            // Remove user from remote users state
            setRemoteUsers((prevUsers) =>
              prevUsers.filter((u) => u.uid !== user.uid)
            );
            const playerContainer = document.getElementById(
              user.uid.toString()
            );
            playerContainer?.remove();
          });

          client?.on("user-left", (user) => {
            setRemoteUsers((prevUsers) =>
              prevUsers.filter((u) => u.uid !== user.uid)
            );
            const playerContainer = document.getElementById(
              user.uid.toString()
            );
            playerContainer?.remove();
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
        client?.leave();
      };
    }
  }, []);
  const toggleVideo = () => {
    if (localVideoTrack) {
      if (videoActive) {
        localVideoTrack.stop(); // Stops the video track, freeing up the camera
      } else {
        localVideoTrack.play("local-container"); // Restarts the video track
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
  return (
    <div>
      <div
        id="local-container"
        style={{ width: "320px", height: "240px" }}
      ></div>
      <button onClick={toggleVideo}>Toggle Video</button>
      <button onClick={toggleAudio}>Toggle Audio</button>
      <div id="remote-container"></div>
    </div>
  );
};

export default Meeting;
