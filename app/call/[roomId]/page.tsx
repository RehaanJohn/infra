"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useEffect, useState } from "react";
import { VideoStage } from "@/components/Call/VideoStage";
import { PipVideo } from "@/components/Call/PipVideo";
import { FloatingDock } from "@/components/Controls/FloatingDock";

export default function CallRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter();
  const { roomId } = use(params);
  const { socket, isConnected } = useSocket();
  const { localStream, startStream, stopStream, toggleAudio, toggleVideo, error } = useMediaStream();
  const { remoteStream, connectionState, iceState } = useWebRTC({
    socket,
    roomId,
    localStream,
  });

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    startStream();
  }, [startStream]);

  useEffect(() => {
    if (isConnected && socket) {
      socket.emit('join-room', { 
        roomId, 
        user: { 
          socketId: socket.id, 
          userId: 'user-' + Math.floor(Math.random() * 1000), 
          name: 'Guest' 
        } 
      });
    }
  }, [isConnected, socket, roomId]);

  const handleToggleAudio = () => {
    toggleAudio();
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleEndCall = () => {
    stopStream();
    router.push('/connect');
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* Main Remote Video Area */}
      <VideoStage stream={remoteStream} connectionState={connectionState} />

      {/* Picture-in-Picture Local Video */}
      <PipVideo 
        stream={localStream} 
        isAudioEnabled={isAudioEnabled} 
        isVideoEnabled={isVideoEnabled} 
      />

      {/* Bottom Floating Controls */}
      <FloatingDock 
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onEndCall={handleEndCall}
      />
    </div>
  );
}
