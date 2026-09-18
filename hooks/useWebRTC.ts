import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { RTC_CONFIG } from '@/lib/webrtc/config';

interface UseWebRTCProps {
  socket: Socket | null;
  roomId: string;
  localStream: MediaStream | null;
}

export function useWebRTC({ socket, roomId, localStream }: UseWebRTCProps) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [iceState, setIceState] = useState<RTCIceConnectionState>('new');
  
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const makingOffer = useRef(false);
  const ignoreOffer = useRef(false);

  // Initialize PeerConnection
  const initPeer = useCallback((targetSocketId: string, isPolite: boolean) => {
    const pc = new RTCPeerConnection(RTC_CONFIG);
    peerRef.current = pc;

    // Attach local tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    // Capture incoming remote tracks
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      } else {
        const stream = new MediaStream([event.track]);
        setRemoteStream(stream);
      }
    };

    // Trickle ICE candidates to remote peer
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('signal-ice', {
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => setConnectionState(pc.connectionState);
    pc.oniceconnectionstatechange = () => setIceState(pc.iceConnectionState);

    // Perfect negotiation logic
    pc.onnegotiationneeded = async () => {
      try {
        makingOffer.current = true;
        await pc.setLocalDescription();
        socket?.emit('signal-offer', {
          targetSocketId,
          sdp: pc.localDescription,
        });
      } catch (err) {
        console.error('Negotiation offer error:', err);
      } finally {
        makingOffer.current = false;
      }
    };

    return pc;
  }, [localStream, socket]);

  // Socket signaling handler binding
  useEffect(() => {
    if (!socket) return;

    socket.on('signal-offer', async ({ senderSocketId, sdp }) => {
      const isPolite = true; // Callee is polite
      let pc = peerRef.current;
      if (!pc) {
        pc = initPeer(senderSocketId, isPolite);
      }

      const offerCollision =
        makingOffer.current || pc.signalingState !== 'stable';

      ignoreOffer.current = !isPolite && offerCollision;
      if (ignoreOffer.current) return;

      try {
        await pc.setRemoteDescription(sdp);
        await pc.setLocalDescription();
        socket.emit('signal-answer', {
          targetSocketId: senderSocketId,
          sdp: pc.localDescription,
        });
      } catch (err) {
        console.error('Failed to handle incoming offer:', err);
      }
    });

    socket.on('signal-answer', async ({ sdp }) => {
      const pc = peerRef.current;
      if (!pc) return;
      try {
        await pc.setRemoteDescription(sdp);
      } catch (err) {
        console.error('Failed to set remote answer:', err);
      }
    });

    socket.on('signal-ice', async ({ candidate }) => {
      const pc = peerRef.current;
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        if (!ignoreOffer.current) {
          console.error('Failed to add ICE candidate:', err);
        }
      }
    });

    // Handle new member joining
    socket.on('user-joined', ({ socketId }) => {
       // Start connection proactively as the impolite peer (caller)
       initPeer(socketId, false);
    });

    return () => {
      socket.off('signal-offer');
      socket.off('signal-answer');
      socket.off('signal-ice');
      socket.off('user-joined');
    };
  }, [socket, initPeer]);

  return { remoteStream, connectionState, iceState, peerRef };
}
