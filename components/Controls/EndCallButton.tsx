"use client";

import { PhoneOff } from "lucide-react";
import { motion } from "framer-motion";

interface EndCallButtonProps {
  onClick: () => void;
}

export function EndCallButton({ onClick }: EndCallButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      title="End Call"
      aria-label="End Call"
    >
      <PhoneOff className="w-6 h-6" />
    </motion.button>
  );
}
