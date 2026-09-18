"use client";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { MediaButton } from "./MediaButton";
import { EndCallButton } from "./EndCallButton";
import { motion } from "framer-motion";

interface FloatingDockProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function FloatingDock({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}: FloatingDockProps) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <MediaButton
        icon={Mic}
        offIcon={MicOff}
        isActive={isAudioEnabled}
        onClick={onToggleAudio}
        label={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
      />
      
      <EndCallButton onClick={onEndCall} />
      
      <MediaButton
        icon={Video}
        offIcon={VideoOff}
        isActive={isVideoEnabled}
        onClick={onToggleVideo}
        label={isVideoEnabled ? "Turn off Camera" : "Turn on Camera"}
      />
    </motion.div>
  );
}
