"use client";

import { useState } from "react";
import WebThreads from "@/components/WebThreads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ClipboardCheck, AlertTriangle, Video, Calendar, Sparkles, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const stats = [
  {
    title: "Institutes Monitored",
    value: "2,450",
    description: "+12 from yesterday",
    icon: Building2,
  },
  {
    title: "Active Inspections",
    value: "148",
    description: "32 pending PMU review",
    icon: ClipboardCheck,
  },
  {
    title: "Flagged Today",
    value: "7",
    description: "Requires immediate attention",
    icon: AlertTriangle,
    alert: true,
  },
];

const initialRecommendations = [
  { 
    id: "co-1", 
    name: "Apex Manufacturing Ltd.", 
    location: "Pune, Maharashtra", 
    type: "physical",
    reason: "High anomaly score in recent compliance reports. On-site verification required.",
    status: "pending" // pending, scheduled
  },
  { 
    id: "co-2", 
    name: "TechNova Solutions", 
    location: "Bangalore, Karnataka", 
    type: "conference",
    reason: "Routine quarterly review. Suitable for remote conference inspection.",
    status: "pending"
  },
  { 
    id: "co-3", 
    name: "Sunrise Pharmaceuticals", 
    location: "Baddi, Himachal Pradesh", 
    type: "physical",
    reason: "Follow-up required on safety protocols flagged last month.",
    status: "pending"
  },
];

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const handleSchedule = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status: "scheduled" } : rec)
    );
    setOpenDialogId(null);
  };

  return (
    <div className="flex-1 w-full flex flex-col h-full overflow-y-auto">
      {/* Header section with WebThreads background */}
      <div className="relative w-full h-[280px] bg-slate-950 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 z-0">
          <WebThreads
            color1="#2dd4bf" // Teal
            color2="#3b82f6" // Blue
            color3="#8b5cf6" // Violet
            speed={0.25}
            threadCount={8}
            frequency={4.5}
            spread={0.2}
            taper={1.2}
            position={0.5}
            fanMode="center"
            glow={0.03}
            falloff={0.5}
            thickness={1.2}
            brightness={0.7}
            opacity={0.85}
            mirror={true}
            shimmer={true}
            grain={true}
            grainIntensity={0.03}
            mouseInteraction={true}
            mouseStrength={0.4}
          />
        </div>
        <div className="relative z-10 p-8 h-full flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">System Overview</h1>
          <p className="text-slate-300 max-w-2xl">
            Department of Social Justice and Empowerment (DoSJE) central monitoring prototype. 
            Real-time insights and AI-driven inspection scheduling.
          </p>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.alert ? "text-destructive" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Recommendations Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <h2 className="text-xl font-semibold tracking-tight">AI Recommended Inspections</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className={`overflow-hidden flex flex-col ${rec.status === 'scheduled' ? 'border-teal-500/50 bg-teal-50/50' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={rec.type === 'physical' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-purple-600 border-purple-200 bg-purple-50'}>
                      {rec.type === 'physical' ? (
                        <><Users className="w-3 h-3 mr-1" /> Physical</>
                      ) : (
                        <><Video className="w-3 h-3 mr-1" /> Conference</>
                      )}
                    </Badge>
                    {rec.status === 'scheduled' && (
                      <Badge className="bg-teal-500">Scheduled</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{rec.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {rec.location}
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 flex-1">
                  <p><span className="font-medium text-slate-900">AI Reason:</span> {rec.reason}</p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  {rec.status === 'pending' ? (
                    <Dialog open={openDialogId === rec.id} onOpenChange={(open) => setOpenDialogId(open ? rec.id : null)}>
                      <DialogTrigger className="w-full flex items-center justify-center h-9 px-4 py-2 gap-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition-colors">
                        <Calendar className="w-4 h-4" /> Schedule Inspection
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule Inspection</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to schedule an immediate inspection for <strong>{rec.name}</strong>?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => setOpenDialogId(null)}>Cancel</Button>
                          <Button onClick={() => handleSchedule(rec.id)}>Confirm Schedule</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Link href={`/inspection/${rec.id}`}>
                      <Button className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                        <Video className="w-4 h-4" /> Start Inspection
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
