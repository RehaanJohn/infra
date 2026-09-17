"use client";

import { use, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, ArrowLeft, Mic, MicOff, VideoOff, PhoneOff, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function InspectionRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [ipCameraUrl, setIpCameraUrl] = useState("");
  const [activeCameraUrl, setActiveCameraUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize Inspector's local webcam
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        toast.error("Failed to access local webcam/microphone.");
        console.error(err);
      }
    };

    initLocalStream();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const connectToCamera = () => {
    if (!ipCameraUrl.trim()) {
      toast.warning("Please enter a valid IP Camera URL.");
      return;
    }

    // For IP Camera Lite apps, the stream is usually an MJPEG feed accessed via HTTP
    // e.g., http://192.168.1.5:8080/video
    setActiveCameraUrl(ipCameraUrl.trim());
    setIsConnected(true);
    toast.success("Attempting to connect to camera feed...");
  };

  const handleDisconnect = () => {
    setActiveCameraUrl(null);
    setIsConnected(false);
    toast("Camera disconnected.");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold tracking-tight">Inspection Room: {id.toUpperCase()}</h1>
              {isConnected && (
                <Badge className="bg-teal-500 hover:bg-teal-600">
                  <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
                  LIVE
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {!isConnected && (
          <div className="flex items-center gap-2 max-w-[500px] w-full">
            <Input 
              placeholder="Enter IP Camera URL (e.g. http://192.168.1.5:8080/video)" 
              value={ipCameraUrl}
              onChange={(e) => setIpCameraUrl(e.target.value)}
              className="bg-slate-50 font-mono text-sm"
            />
            <Button onClick={connectToCamera}>
              Connect
            </Button>
          </div>
        )}

        {isConnected && (
          <Button variant="destructive" size="sm" onClick={handleDisconnect} className="gap-2">
            <PhoneOff className="w-4 h-4" /> Disconnect
          </Button>
        )}
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-4 md:p-8 flex flex-col lg:flex-row gap-4 bg-slate-100 overflow-y-auto">
        
        {/* Remote Feed (Main) */}
        <Card className="flex-1 relative overflow-hidden bg-slate-950 flex flex-col justify-center border-slate-300 min-h-[400px]">
          {!isConnected ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-4 p-6 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-300">Waiting for IP Camera connection</h3>
                <p className="text-sm mt-1 max-w-sm mx-auto">
                  Enter the video stream URL provided by the IP Camera Lite app (e.g., http://&lt;phone-ip&gt;:8080/video)
                </p>
              </div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={activeCameraUrl!} 
              alt="Live feed"
              className="w-full h-full object-contain"
              onError={() => {
                toast.error("Failed to load image feed. Check the URL and ensure you are on the same network.");
              }}
            />
          )}
          
          {isConnected && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-slate-900/60 text-white border-slate-700 backdrop-blur-md">
                On-Site Camera Feed
              </Badge>
            </div>
          )}
        </Card>

        {/* Local Inspector Feed (Sidebar) */}
        <Card className="w-full lg:w-80 flex-shrink-0 bg-slate-900 border-slate-300 overflow-hidden relative aspect-video lg:aspect-auto min-h-[200px]">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted // Mute local preview
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-slate-900/60 text-white border-slate-700 backdrop-blur-md">
              Inspector (You)
            </Badge>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Button size="icon" variant="secondary" className="rounded-full bg-slate-900/60 text-white hover:bg-slate-800 backdrop-blur-md w-10 h-10 border border-slate-700">
              <Mic className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-slate-900/60 text-white hover:bg-slate-800 backdrop-blur-md w-10 h-10 border border-slate-700">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
