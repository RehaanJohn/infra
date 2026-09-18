export const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    // Free Public STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // TURN relay required for symmetric NAT traversal
    {
      urls: process.env.NEXT_PUBLIC_TURN_URL || 'turn:turn.yourdomain.com:3478',
      username: process.env.NEXT_PUBLIC_TURN_USERNAME || 'webrtc-user',
      credential: process.env.NEXT_PUBLIC_TURN_PASSWORD || 'turn-secret',
    },
  ],
  iceCandidatePoolSize: 10,
};

export const DEFAULT_MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { ideal: 1920, min: 1280 },
    height: { ideal: 1080, min: 720 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: 'user',
  },
};
