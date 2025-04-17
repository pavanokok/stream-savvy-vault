
import React from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import VideoCard from "@/components/VideoCard";

const popularVideos = [
  {
    id: "video1",
    title: "How to Make a Perfect Cup of Coffee at Home",
    thumbnail: "https://picsum.photos/seed/coffee/640/360",
    duration: "8:24",
    author: "Coffee Masters",
    url: "https://www.youtube.com/watch?v=sample1"
  },
  {
    id: "video2",
    title: "10 Must-See Travel Destinations for 2023",
    thumbnail: "https://picsum.photos/seed/travel/640/360",
    duration: "12:45",
    author: "Wanderlust Adventures",
    url: "https://www.youtube.com/watch?v=sample2"
  },
  {
    id: "video3",
    title: "Beginner's Guide to Digital Photography",
    thumbnail: "https://picsum.photos/seed/photo/640/360",
    duration: "15:30",
    author: "Photo Expert",
    url: "https://www.youtube.com/watch?v=sample3"
  },
  {
    id: "video4",
    title: "Easy 30-Minute Workout for Beginners",
    thumbnail: "https://picsum.photos/seed/workout/640/360",
    duration: "29:50",
    author: "Fitness Focus",
    url: "https://www.youtube.com/watch?v=sample4"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-nova-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Download Videos with <span className="text-nova-purple">NovaTube</span>
            </h1>
            <p className="text-nova-gray max-w-2xl mx-auto">
              Simple, fast and reliable video downloader for YouTube, Instagram and more. No ads, no hassle.
            </p>
          </div>
          
          <SearchBar />
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Popular Downloads</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
        
        <section className="mt-16 bg-nova-dark-surface p-6 rounded-xl border border-nova-purple/20">
          <h2 className="text-xl font-semibold text-white mb-4">How to Use NovaTube</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="mx-auto w-12 h-12 bg-nova-purple/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-nova-purple text-xl font-bold">1</span>
              </div>
              <h3 className="text-white font-medium mb-2">Paste URL</h3>
              <p className="text-nova-gray text-sm">
                Copy the video URL from YouTube or Instagram and paste it in the search bar
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="mx-auto w-12 h-12 bg-nova-purple/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-nova-purple text-xl font-bold">2</span>
              </div>
              <h3 className="text-white font-medium mb-2">Select Format</h3>
              <p className="text-nova-gray text-sm">
                Choose your preferred video format and quality from the available options
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="mx-auto w-12 h-12 bg-nova-purple/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-nova-purple text-xl font-bold">3</span>
              </div>
              <h3 className="text-white font-medium mb-2">Download</h3>
              <p className="text-nova-gray text-sm">
                Click the download button and wait for your video to be ready
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-nova-dark-surface py-6 mt-12 border-t border-nova-purple/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-nova-gray text-sm">
            © {new Date().getFullYear()} NovaTube. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
