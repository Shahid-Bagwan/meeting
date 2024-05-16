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

  // async initialize(appId: string) {
  //   await this.client.initialize(appId);
  // }

  async joinChannel(appId: string, channel: string, token: string, uid: UID) {
    await this.client.join(appId, channel, token, uid);
  }

  async leaveChannel() {
    await this.client.leave();
    this.localVideoTrack?.close();
    this.localAudioTrack?.close();
    this.remoteUsers.clear();
  }

  async createLocalTracks() {
    const [audioTrack, videoTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks();
    this.localVideoTrack = videoTrack;
    this.localAudioTrack = audioTrack;
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
}

export const agoraService = new AgoraService();
