"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MicOff, VideoOff } from "lucide-react";

interface PipVideoProps {
  stream: MediaStream | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

export function PipVideo({ stream, isAudioEnabled, isVideoEnabled }: PipVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <motion.div
      ref={containerRef}
      drag
      dragConstraints={{ top: 16, right: -16, bottom: -16, left: 16 }}
      dragElastic={0.1}
      dragMomentum={false}
      initial={{ scale: 0, opacity: 0, x: 20, y: -20 }}
      animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute top-4 right-4 w-40 aspect-[3/4] sm:w-48 sm:aspect-video z-40 cursor-grab active:cursor-grabbing"
    >
      <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-800 shadow-2xl border border-white/10 relative">
        {stream && isVideoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
            <VideoOff className="w-8 h-8" />
          </div>
        )}

        {/* Status Indicators overlay */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {!isAudioEnabled && (
            <div className="bg-red-500/80 backdrop-blur text-white p-1 rounded-full">
              <MicOff className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
