import AgoraRTM from "agora-rtm-sdk";
import config from "../agoraManager/config";

const SignalingManager = async (messageCallback, eventsCallback, rtmConfig) => {
  let signalingEngine = null;
  let signalingChannel = null;

  const setupSignalingEngine = async (rtmConfig) => {
    try {
      rtmConfig = rtmConfig || {
        token: config.rtcToken,
        useStringUserId: config.useStringUserId,
        logUpload: config.logUpload,
        presenceTimeout: config.presenceTimeout,
      };
      console.log("RTM Config:", rtmConfig, config.rtcToken, config.uid);
      signalingEngine = new AgoraRTM.RTM(config.appId, config.uid, rtmConfig);
      return signalingEngine;
    } catch (error) {
      console.log("Error:", error);
    }

    signalingEngine.addEventListener("message", (eventArgs) => {
      eventsCallback("message", eventArgs);
      messageCallback(
        "Received message from " +
          eventArgs.publisher +
          ": " +
          eventArgs.message
      );
    });
    signalingEngine.addEventListener("status", (eventArgs) => {
      eventsCallback("status", eventArgs);
      messageCallback(
        "Connection state changed to: " +
          eventArgs.state +
          ", Reason: " +
          eventArgs.reason
      );
    });
    signalingEngine.addEventListener("presence", (eventArgs) => {
      eventsCallback("presence", eventArgs);
      if (eventArgs.eventType === "SNAPSHOT") {
        messageCallback(
          `User ${eventArgs.snapshot[0].userId} joined channel ${eventArgs.channelName}`
        );
      } else {
        messageCallback(
          "Presence event: " +
            eventArgs.eventType +
            ", User: " +
            eventArgs.publisher
        );
      }
    });
    signalingEngine.addEventListener("storage", (eventArgs) => {
      eventsCallback("storage", eventArgs);
    });
    signalingEngine.addEventListener("topic", (eventArgs) => {
      eventsCallback("topic", eventArgs);
    });
    signalingEngine.addEventListener("lock", (eventArgs) => {
      eventsCallback("lock", eventArgs);
    });
    signalingEngine.addEventListener(
      "TokenPrivilegeWillExpire",
      (eventArgs) => {
        eventsCallback("TokenPrivilegeWillExpire", eventArgs);
      }
    );
  };

  const login = async (uid, token) => {
    try {
      if (uid !== undefined) config.uid = uid;
      if (token !== undefined) config.token = token;

      const res = await setupSignalingEngine(rtmConfig);
      if (res) {
        console.log("Signaling Engine:", signalingEngine);

        const result = await signalingEngine.login();
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSignalingEngine = () => {
    return signalingEngine;
  };

  const logout = async () => {
    await signalingEngine.logout();
  };

  const createChannel = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      signalingChannel = await signalingEngine.createStreamChannel(channelName);
    } catch (error) {
      console.error(error);
    }
  };

  const subscribe = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      const subscribeOptions = {
        withMessage: true,
        withPresence: true,
        withMetadata: true,
        withLock: true,
      };
      await signalingEngine.subscribe(channelName, subscribeOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const unsubscribe = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      await signalingEngine.unsubscribe(channelName);
      messageCallback("You have successfully left channel " + channelName);
    } catch (error) {
      console.log(error);
    }
  };

  const sendChannelMessage = async (channelName, Message) => {
    const payload = { type: "text", message: Message };
    const publishMessage = JSON.stringify(payload);
    try {
      const sendResult = await signalingEngine.publish(
        channelName,
        publishMessage
      );
      messageCallback(`Message sent to channel ${channelName}: ${Message}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getOnlineMembersInChannel = async (channelName, channelType) => {
    const result = await getSignalingEngine().presence.getOnlineUsers(
      channelName,
      channelType
    );
    return result.occupants;
  };

  return {
    getSignalingEngine,
    config,
    login,
    logout,
    createChannel,
    subscribe,
    unsubscribe,
    sendChannelMessage,
    getOnlineMembersInChannel,
  };
};

export default SignalingManager;
