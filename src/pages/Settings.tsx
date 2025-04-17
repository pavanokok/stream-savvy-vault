
import React, { useState } from "react";
import Header from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Settings = () => {
  const [theme, setTheme] = useState("dark");
  const [autoDownload, setAutoDownload] = useState(false);
  const [downloadLocation, setDownloadLocation] = useState("~/Downloads");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultFormat, setDefaultFormat] = useState("mp4");
  const [defaultQuality, setDefaultQuality] = useState("720p");
  const [maxConcurrentDownloads, setMaxConcurrentDownloads] = useState([2]);

  const handleSave = () => {
    // In a real app, this would save settings to local storage or a backend
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    // Reset to defaults
    setTheme("dark");
    setAutoDownload(false);
    setDownloadLocation("~/Downloads");
    setNotificationsEnabled(true);
    setDefaultFormat("mp4");
    setDefaultQuality("720p");
    setMaxConcurrentDownloads([2]);
    
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="min-h-screen bg-nova-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
          
          <div className="bg-nova-dark-surface rounded-xl border border-nova-purple/20 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Appearance</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col space-y-3">
                <Label className="text-white">Theme</Label>
                <RadioGroup value={theme} onValueChange={setTheme} className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="text-nova-gray">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="text-nova-gray">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="text-nova-gray">System</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          
          <div className="bg-nova-dark-surface rounded-xl border border-nova-purple/20 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Download Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-download" className="text-white">Auto Download</Label>
                  <p className="text-xs text-nova-gray">Automatically start download after fetching video info</p>
                </div>
                <Switch 
                  id="auto-download" 
                  checked={autoDownload} 
                  onCheckedChange={setAutoDownload} 
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <Label className="text-white">Default Format</Label>
                <RadioGroup value={defaultFormat} onValueChange={setDefaultFormat} className="flex flex-wrap gap-2">
                  {["mp4", "webm", "mp3", "aac"].map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <RadioGroupItem value={format} id={`format-${format}`} />
                      <Label htmlFor={`format-${format}`} className="text-nova-gray">{format.toUpperCase()}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Label className="text-white">Default Quality</Label>
                <RadioGroup value={defaultQuality} onValueChange={setDefaultQuality} className="flex flex-wrap gap-2">
                  {["360p", "480p", "720p", "1080p"].map((quality) => (
                    <div key={quality} className="flex items-center space-x-2">
                      <RadioGroupItem value={quality} id={`quality-${quality}`} />
                      <Label htmlFor={`quality-${quality}`} className="text-nova-gray">{quality}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <Label className="text-white">Max Concurrent Downloads: {maxConcurrentDownloads[0]}</Label>
                </div>
                <Slider
                  value={maxConcurrentDownloads}
                  onValueChange={setMaxConcurrentDownloads}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-nova-dark-surface rounded-xl border border-nova-purple/20 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-white">Enable Notifications</Label>
                  <p className="text-xs text-nova-gray">Notify when downloads are complete</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled} 
                  onCheckedChange={setNotificationsEnabled} 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={handleReset} className="border-nova-purple text-nova-purple">
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} className="bg-nova-purple hover:bg-nova-purple/90">
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
