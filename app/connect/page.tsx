"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, Hash } from "lucide-react";
import { motion } from "framer-motion";

export default function ConnectPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/call/${roomId.trim()}`);
    }
  };

  const generateRandomRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(randomId);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-teal-500/20 text-teal-400 flex items-center justify-center rounded-full mb-4">
              <Video className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Join Secure Meeting</CardTitle>
            <CardDescription className="text-slate-400">
              Enter a room code to join a peer-to-peer WebRTC call, or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Enter Room Code"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-lg uppercase tracking-wider text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
                  maxLength={12}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateRandomRoom}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Generate Code
                </Button>
                <Button 
                  type="submit" 
                  disabled={!roomId.trim()}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20"
                >
                  Join Room
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
