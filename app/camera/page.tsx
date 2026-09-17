"use client";

import { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import { Camera, Smartphone, Wifi, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CameraPage() {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // We only want this to run in the browser
    if (typeof window === "undefined") return;

    let peer: Peer;

    const initPeer = async () => {
      try {
        peer = new Peer(); 

        peer.on("open", (id) => {
          setPeerId(id);
        });

        peer.on("error", (err) => {
          console.error("PeerJS error:", err);
          setError(err.message);
        });

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" }, 
          audio: true // Assuming audio is also useful for inspections
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // When the desktop calls this phone, answer with our camera stream
        peer.on("call", (call) => {
          setIsConnected(true);
          call.answer(stream);
          
          call.on("close", () => {
            setIsConnected(false);
          });
        });

      } catch (err: any) {
        console.error("Failed to get media or connect:", err);
        setError("Camera access denied or secure context (HTTPS) required.");
      }
    };

    initPeer();

    return () => {
      if (peer) peer.destroy();
      // Stop media tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white p-4 items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <Smartphone className="w-12 h-12 mx-auto text-teal-400 mb-4" />
          <h1 className="text-2xl font-bold">Inspection Camera Mode</h1>
          <p className="text-slate-400 text-sm">
            Keep this screen open. Provide the code below to the inspector.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800 text-center p-6">
          <CardContent className="p-0 space-y-2">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Connection Code</p>
            {peerId ? (
              <div className="text-4xl font-mono tracking-wider font-bold text-teal-400 bg-slate-950 p-4 rounded-lg border border-slate-800">
                {peerId}
              </div>
            ) : (
              <div className="text-lg font-medium text-slate-400 flex items-center justify-center gap-2 h-20">
                <Loader2 className="w-5 h-5 animate-spin" /> Generating...
              </div>
            )}
            {error && (
              <p className="text-red-400 text-sm mt-4">{error}</p>
            )}
          </CardContent>
        </Card>

        <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] sm:aspect-video border-2 border-slate-800 shadow-2xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted // Mute local preview so the user doesn't hear themselves
            className="w-full h-full object-cover" 
          />
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${isConnected ? 'bg-teal-500/80 text-white' : 'bg-slate-800/80 text-slate-300'}`}>
              <Wifi className="w-3 h-3" />
              {isConnected ? "INSPECTOR CONNECTED" : "WAITING FOR CONNECTION"}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
