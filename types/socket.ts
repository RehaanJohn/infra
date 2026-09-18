export interface UserIdentity {
  socketId: string;
  userId: string;
  name: string;
  avatarUrl?: string;
}

export interface SignalingPayloads {
  'join-room': { roomId: string; user: UserIdentity };
  'user-joined': { user: UserIdentity };
  'user-left': { socketId: string };
  
  // SDP Negotiation
  'signal-offer': { targetSocketId: string; sdp: RTCSessionDescriptionInit };
  'signal-answer': { targetSocketId: string; sdp: RTCSessionDescriptionInit };
  
  // ICE Candidates
  'signal-ice': { targetSocketId: string; candidate: RTCIceCandidateInit };
  
  // In-Call Track/State Sync
  'media-state-change': {
    audioEnabled: boolean;
    videoEnabled: boolean;
    isScreenSharing: boolean;
  };
  
  // FaceTime Call Initiation
  'call-request': { targetUserId: string; caller: UserIdentity; roomId: string };
  'call-response': { accepted: boolean; roomId: string; reason?: 'busy' | 'declined' };
}
