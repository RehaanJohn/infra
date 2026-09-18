export type ConnectionState = RTCPeerConnectionState | 'new';
export type IceConnectionState = RTCIceConnectionState | 'new';

export interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
}
