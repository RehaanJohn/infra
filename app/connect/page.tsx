"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2, CheckCircle2, ShieldAlert, Video } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ConnectCamera() {
  const router = useRouter();
  const [step, setStep] = useState("discover");
  
  // Step 1 state
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<any[]>([]);

  // Step 2 state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  // Step 3 state
  const [isSaving, setIsSaving] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setFoundDevices([]);
    // Mock network scan delay
    setTimeout(() => {
      setFoundDevices([
        { ip: "192.168.1.105", port: "554", name: "Generic RTSP Device" },
        { ip: "192.168.1.200", port: "80", name: "ONVIF Camera Profile S" }
      ]);
      setIsScanning(false);
      toast.success("Found 2 devices on local network");
    }, 2000);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    // Mock connection test
    setTimeout(() => {
      setIsTesting(false);
      // Randomly succeed or fail for prototype demonstration (mostly succeed)
      const success = Math.random() > 0.2; 
      if (success) {
        setTestResult("success");
        toast.success("Connection established successfully");
      } else {
        setTestResult("error");
        toast.error("Failed to authenticate. Check credentials.");
      }
    }, 1500);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Camera saved successfully");
      router.push("/");
    }, 1000);
  };

  return (
    <div className="flex-1 w-full p-8 max-w-4xl mx-auto flex flex-col h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Connect New Camera</h1>
        <p className="text-muted-foreground">Add a new IP camera feed to the monitoring dashboard.</p>
      </div>

      <Alert className="mb-8 bg-blue-50/50 text-blue-900 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle>Using an iPhone as a Camera?</AlertTitle>
        <AlertDescription className="text-blue-800/80">
          To pair this with an iPhone, ensure the phone is connected to the same Wi-Fi network and broadcasting an RTSP/ONVIF stream URL via a compatible camera app. Enter that local URL below.
        </AlertDescription>
      </Alert>

      <Tabs value={step} onValueChange={setStep} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="discover" disabled={step !== "discover" && step !== "credentials" && step !== "preview"}>1. Discover</TabsTrigger>
          <TabsTrigger value="credentials" disabled={step === "discover"}>2. Credentials</TabsTrigger>
          <TabsTrigger value="preview" disabled={step !== "preview"}>3. Preview & Save</TabsTrigger>
        </TabsList>

        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <CardTitle>Network Discovery</CardTitle>
              <CardDescription>Enter the camera's network details or scan the local network.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ip">IP Address / URL</Label>
                  <Input id="ip" placeholder="192.168.1.100" defaultValue="192.168.1.105" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" placeholder="554" defaultValue="554" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Select defaultValue="rtsp">
                  <SelectTrigger id="protocol">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rtsp">RTSP (Real Time Streaming Protocol)</SelectItem>
                    <SelectItem value="onvif">ONVIF</SelectItem>
                    <SelectItem value="http">HTTP/MJPEG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Auto-Discovery</h3>
                  <Button variant="secondary" size="sm" onClick={handleScan} disabled={isScanning}>
                    {isScanning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isScanning ? "Scanning..." : "Scan Network"}
                  </Button>
                </div>
                
                {foundDevices.length > 0 && (
                  <div className="space-y-2">
                    {foundDevices.map((device, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                        <div>
                          <p className="font-medium text-sm">{device.name}</p>
                          <p className="text-xs text-muted-foreground">{device.ip}:{device.port}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toast("Device selected")}>Use</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setStep("credentials")}>Continue to Credentials</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Enter the username and password for the IP camera.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="admin" defaultValue="admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" defaultValue="password123" />
              </div>

              <div className="pt-4 mt-4 border-t flex flex-col items-center">
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                >
                  {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Test Connection
                </Button>
                
                {testResult === "success" && (
                  <div className="mt-4 flex items-center text-teal-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Connection verified
                  </div>
                )}
                {testResult === "error" && (
                  <div className="mt-4 flex items-center text-destructive text-sm font-medium">
                    <ShieldAlert className="w-4 h-4 mr-2" /> Authentication failed
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep("discover")}>Back</Button>
              <Button 
                onClick={() => setStep("preview")} 
                disabled={testResult !== "success"}
              >
                Continue to Preview
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Confirm & Save</CardTitle>
              <CardDescription>Review the camera feed and assign details for the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="w-full aspect-video bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center border border-slate-800">
                {/* Placeholder Video - static image or simple animated element */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 flex flex-col items-center text-slate-400">
                  <Video className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm uppercase tracking-widest">Live Feed Preview</p>
                  <p className="text-xs mt-1 text-slate-500">RTSP: 192.168.1.105:554/stream1</p>
                </div>
                
                {/* Fake recording indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-white font-medium shadow-sm">REC</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="cam-name">Camera Name</Label>
                  <Input id="cam-name" placeholder="e.g. Hallway B Camera" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Institute / Location</Label>
                  <Select>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nit-t">NIT Trichy</SelectItem>
                      <SelectItem value="iit-d">IIT Delhi</SelectItem>
                      <SelectItem value="nit-k">NIT Surathkal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep("credentials")}>Back</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Camera
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
