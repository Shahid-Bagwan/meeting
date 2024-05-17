// services/agoraService.ts
import AgoraRTC, {
  IAgoraRTCClient,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  ILocalVideoTrack,
  ILocalAudioTrack,
  // ICameraVideoTrack,
  // IMicrophoneAudioTrack,
  ScreenVideoTrackInitConfig,
  UID,
} from "agora-rtc-sdk-ng";

class AgoraService {
  client: IAgoraRTCClient;
  localVideoTrack?: ILocalVideoTrack;
  localAudioTrack?: ILocalAudioTrack;
  remoteUsers: Map<
    UID,
    { videoTrack?: IRemoteVideoTrack; audioTrack?: IRemoteAudioTrack }
  > = new Map();

  constructor() {
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }

  // New state to keep track of participants and chat messages
  participants: Array<{ uid: UID; cameraOn: boolean; micOn: boolean }> = [];
  chatMessages: Array<{ uid: UID; message: string }> = [];

  async joinChannel(appId: string, channel: string, token: string, uid: UID) {
    await this.client.join(appId, channel, token, uid);
    // Add event listeners for user-published and user-unpublished
    this.client.on("user-published", this.handleUserPublished.bind(this));
    this.client.on("user-unpublished", this.handleUserUnpublished.bind(this));
  }

  async leaveChannel() {
    await this.client.leave();
    this.localVideoTrack?.close();
    this.localAudioTrack?.close();
    this.remoteUsers.clear();
    this.participants = [];
    this.chatMessages = [];
  }

  async createLocalTracks() {
    const [audioTrack, videoTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks();
    this.localVideoTrack = videoTrack;
    this.localAudioTrack = audioTrack;
    if (this.localAudioTrack && this.localVideoTrack) {
      console.log("its working", this.localAudioTrack, this.localVideoTrack);
    }
  }

  async publishLocalTracks() {
    if (this.localVideoTrack && this.localAudioTrack) {
      await this.client.publish([this.localVideoTrack, this.localAudioTrack]);
    }
  }

  async unpublishLocalTracks() {
    if (this.localVideoTrack && this.localAudioTrack) {
      await this.client.unpublish([this.localVideoTrack, this.localAudioTrack]);
    }
  }

  async createScreenTrack() {
    const config: ScreenVideoTrackInitConfig = {
      encoderConfig: "1080p", // Set desired resolution
      // Additional configurations if needed
    };
    return await AgoraRTC.createScreenVideoTrack(config, "enable");
  }

  // Handle user-published event
  private async handleUserPublished(user: any, mediaType: string) {
    await this.client.subscribe(user, mediaType);
    if (mediaType === "video") {
      this.remoteUsers.set(user.uid, { videoTrack: user.videoTrack });
    } else if (mediaType === "audio") {
      this.remoteUsers.set(user.uid, { audioTrack: user.audioTrack });
    }
    // Add user to participants list
    this.participants.push({
      uid: user.uid,
      cameraOn: mediaType === "video",
      micOn: mediaType === "audio",
    });
  }

  // Handle user-unpublished event
  private handleUserUnpublished(user: any) {
    this.remoteUsers.delete(user.uid);
    // Remove user from participants list
    this.participants = this.participants.filter(
      (participant) => participant.uid !== user.uid
    );
  }

  // Method to send chat message
  sendMessage(uid: UID, message: string) {
    this.chatMessages.push({ uid, message });
    // Notify listeners about the new message
    this.client.emit("message-received", { uid, message });
  }

  // Method to receive chat message
  onMessageReceived(callback: (uid: UID, message: string) => void) {
    this.client.on("message-received", ({ uid, message }) => {
      this.chatMessages.push({ uid, message });
      callback(uid, message);
    });
  }
}

export const agoraService = new AgoraService();
