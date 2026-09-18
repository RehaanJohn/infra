"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MediaButtonProps {
  icon: LucideIcon;
  offIcon?: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  label: string;
}

export function MediaButton({ icon: Icon, offIcon: OffIcon, isActive, onClick, label }: MediaButtonProps) {
  const ActiveIcon = isActive ? Icon : (OffIcon || Icon);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900",
        isActive 
          ? "bg-slate-700/60 text-slate-200 hover:bg-slate-600/80" 
          : "bg-white text-slate-900 hover:bg-slate-200"
      )}
      title={label}
      aria-label={label}
    >
      <ActiveIcon className="w-5 h-5" />
    </motion.button>
  );
}
