"use client";

import { use } from "react";
import { useSocket } from "@/context/SocketContext";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useEffect } from "react";

export default function CallRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { socket, isConnected } = useSocket();
  const { localStream, startStream, toggleAudio, toggleVideo, error } = useMediaStream();
  const { remoteStream, connectionState, iceState } = useWebRTC({
    socket,
    roomId,
    localStream,
  });

  useEffect(() => {
    // Start local media when the component mounts
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Room: {roomId}</h1>
      
      <div className="mb-4 space-y-2">
         <p>Socket Connected: {isConnected ? "Yes" : "No"}</p>
         <p>Peer Connection State: {connectionState}</p>
         <p>ICE Connection State: {iceState}</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Local Video */}
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <video
            autoPlay
            playsInline
            muted
            ref={(video) => {
              if (video && localStream) video.srcObject = localStream;
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">You</div>
        </div>

        {/* Remote Video */}
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          {remoteStream ? (
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video && remoteStream) video.srcObject = remoteStream;
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Waiting for someone to join...
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">Remote User</div>
        </div>
      </div>

      {/* Temporary Controls */}
      <div className="mt-8 flex gap-4">
        <button onClick={toggleAudio} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
          Toggle Mic
        </button>
        <button onClick={toggleVideo} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
          Toggle Camera
        </button>
      </div>
    </div>
  );
}
