"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, ArrowLeft, MoreVertical, Wifi, Activity } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LiveFeed({ params }: { params: Promise<{ id: string }> }) {
  // Extract id from params
  const { id } = use(params);
  
  // Mock data based on id
  const camName = id === "cam-1" ? "Hostel Block A - Corridor" : `Camera ${id}`;
  const location = id === "cam-1" ? "NIT Trichy" : "Unknown Location";

  const handleSnapshot = () => {
    toast.success("Snapshot saved to evidence vault");
  };

  const handleStartVC = () => {
    toast("Initiating random Video Call with PMU officer...", {
      icon: <Video className="w-4 h-4" />,
      description: "Connecting to secure Jitsi meet server..."
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-50">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold tracking-tight">{camName}</h1>
              <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20">
                <span className="w-2 h-2 rounded-full bg-teal-500 mr-2 animate-pulse" />
                LIVE
              </Badge>
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Wifi className="w-3 h-3" /> {location} • 1080p 30fps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSnapshot} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hidden sm:flex">
            <Camera className="w-4 h-4 mr-2" /> Snapshot
          </Button>
          <Button size="sm" onClick={handleStartVC} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Video className="w-4 h-4 mr-2" /> Start random VC
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-800 text-slate-200">
              <DropdownMenuItem className="focus:bg-slate-800 focus:text-white">View Analytics</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-slate-800 focus:text-white">Restart Stream</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Disconnect Camera</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Video Feed Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Placeholder for the actual RTSP stream player (e.g. WebRTC player, JSMpeg) */}
        
        {/* We use a static image to simulate a video frame for the prototype */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888052063-8a30cc8122a7?q=80&w=2938&auto=format&fit=crop')] bg-cover bg-center opacity-70" />
        
        {/* Mock OSD (On-Screen Display) overlays */}
        <div className="absolute top-4 right-4 text-white font-mono text-sm tracking-wider opacity-80 drop-shadow-md">
          {new Date().toISOString().replace('T', ' ').substring(0, 19)}
        </div>
        
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/70 font-mono text-xs">
          <Activity className="w-3 h-3" />
          <span>Bitrate: 2.4 Mbps</span>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
           {/* Invisible element to trigger hover if we wanted to add play controls later */}
        </div>
      </div>
    </div>
  );
}
