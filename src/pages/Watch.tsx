import React, { useState } from 'react';
import { BannerAd } from '../components/BannerAd';

const Watch: React.FC = () => {
  const videos = [
    { id: 1, title: 'DP World Asia Cup 2025: IND vs PAK Final Highlights', duration: '21:45', views: '1.2M', url: 'https://www.youtube.com/embed/fJs1HW4jOXE?autoplay=1&mute=0' },
    { id: 2, title: 'Virat Kohli Best Innings', duration: '12:45', views: '3.4M', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 3, title: 'MS Dhoni Helicopter Shots', duration: '8:15', views: '5.1M', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 4, title: 'Best Catches in Cricket History', duration: '10:20', views: '2.8M', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  ];

  const [activeVideo, setActiveVideo] = useState<{ id: number; title: string; url: string } | null>(videos[0]);

  const handlePlayVideo = (video: typeof videos[0]) => {
    setActiveVideo(video);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-full pb-20">
      <div className="bg-black w-full aspect-video flex items-center justify-center relative">
        {activeVideo ? (
          activeVideo.url.includes('youtube.com') ? (
            <iframe
              className="w-full h-full"
              src={activeVideo.url}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              src={activeVideo.url} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => handlePlayVideo(videos[0])}
                className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors"
              >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
              </button>
            </div>
            <p className="text-white font-bold absolute bottom-4 left-4">Live: IND vs PAK Asia Cup Final</p>
          </>
        )}
      </div>

      <div className="p-4">
        <BannerAd />
        <h2 className="text-xl font-bold mb-4 mt-4 text-gray-800 dark:text-white">
          {activeVideo ? activeVideo.title : 'Watch Free Cricket'}
        </h2>
        
        <div className="space-y-4">
          {videos.map((video) => (
            <div 
              key={video.id} 
              onClick={() => handlePlayVideo(video)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeVideo?.id === video.id ? 'border-2 border-red-500' : ''}`}
            >
              <div className="w-1/3 bg-gray-300 dark:bg-gray-700 relative flex items-center justify-center">
                <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="w-2/3 p-3">
                <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{video.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;
