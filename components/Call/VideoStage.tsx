"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface VideoStageProps {
  stream: MediaStream | null;
  connectionState: RTCPeerConnectionState | "new";
}

export function VideoStage({ stream, connectionState }: VideoStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const isConnecting = connectionState === "new" || connectionState === "connecting";
  const isDisconnected = connectionState === "disconnected" || connectionState === "failed" || connectionState === "closed";

  return (
    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center text-slate-400">
          {isConnecting && (
            <>
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-teal-500" />
              <p className="text-lg font-medium tracking-wide">Waiting for others to join...</p>
            </>
          )}
          {isDisconnected && (
            <p className="text-lg font-medium text-red-400">Call Disconnected</p>
          )}
        </div>
      )}
      
      {/* Subtle Dark Gradient Overlay to make dock more readable */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
    </div>
  );
}
