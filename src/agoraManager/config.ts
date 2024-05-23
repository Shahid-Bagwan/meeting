import { EncryptionMode, UID, SDK_MODE } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "44ac98e9fc0c42e2bcfa9546ff2766d8",
  channelName: "main",
  rtcToken:
    "007eJxTYFiY/I/x9P1EPdblWgyu+w2uOp133VPd9JcpXGDZq/nujcwKDCYmicmWFqmWackGySZGqUZJyWmJlqYmZmlpRuZmZikWSdn+aQ2BjAyMUrsYGKEQxGdhyE3MzGNgAADzXx2o",
  serverUrl: "",
  proxyUrl: "http://localhost:8080/",
  tokenExpiryTime: 600,
  token:
    "007eJxTYFiY/I/x9P1EPdblWgyu+w2uOp133VPd9JcpXGDZq/nujcwKDCYmicmWFqmWackGySZGqUZJyWmJlqYmZmlpRuZmZikWSdn+aQ2BjAyMUrsYGKEQxGdhyE3MzGNgAADzXx2o",
  encryptionMode: "aes-128-gcm2",
  salt: "",
  encryptionKey: "",
  destChannelName: "",
  destChannelToken: "",
  destUID: 2,
  secondChannel: "",
  secondChannelToken: "",
  secondChannelUID: 2,
  selectedProduct: "rtc",
  presenceTimeout: 300,
  logUpload: false,
  logLevel: "debug",
  cloudProxy: true,
  useStringUserId: true,
};

export type configType = {
  uid: UID;
  appId: string;
  channelName: string;
  rtcToken: string | null;
  serverUrl: string;
  proxyUrl: string;
  tokenExpiryTime: number;
  token: string;
  encryptionMode: EncryptionMode;
  salt: "";
  encryptionKey: string;
  destUID: number;
  destChannelName: string;
  destChannelToken: string;
  secondChannel: string;
  secondChannelToken: string;
  secondChannelUID: number;
  selectedProduct: SDK_MODE;
  presenceTimeout: number;
  logUpload: boolean;
  logLevel: string;
  cloudProxy: boolean;
  useStringUserId: boolean;
};

export default config;
