
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import DownloadOptions from "@/components/DownloadOptions";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  url: string;
}

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = (location.state || {}) as { video?: VideoInfo };

  if (!video) {
    return (
      <div className="min-h-screen bg-nova-dark flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
            <p className="text-nova-gray mb-6">No video information was provided. Please search for a video first.</p>
            <Button onClick={() => navigate("/")} className="bg-nova-purple hover:bg-nova-purple/90">
              Go Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nova-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-6 text-nova-gray hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-nova-dark-surface rounded-xl overflow-hidden border border-nova-purple/20">
              <div className="aspect-video relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h1 className="text-xl md:text-2xl font-bold text-white mb-4">
                  {video.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-nova-gray mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{video.author}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{video.duration}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Added today</span>
                  </div>
                </div>
                
                <div className="p-4 bg-nova-dark rounded-lg border border-nova-purple/10">
                  <h3 className="text-sm font-medium text-nova-gray mb-2">Video URL:</h3>
                  <div className="flex items-center bg-nova-dark-surface p-2 rounded overflow-hidden">
                    <p className="text-white text-sm truncate flex-1">{video.url}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <DownloadOptions videoUrl={video.url} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Preview;
