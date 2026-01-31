"use client";

import { useState, useEffect, useRef } from "react";
import Overlay from "@/components/Overlay";
import ProfileCard, { DiscordData } from "@/components/ProfileCard";
import { config } from "@/config";
import { Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [data, setData] = useState<DiscordData | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [bgMuted, setBgMuted] = useState(false);
  const [isFeaturedAudioPlaying, setIsFeaturedAudioPlaying] = useState(false);

  // Dynamic Title Logic
  useEffect(() => {
    if (!data?.username) return;

    // We want to animate the title. 
    // Effect: "!" ... "!" -> "i" -> "t" ...
    // The user asked for Typing animation: "@" -> "@i" -> "@it" ... -> "@its manish" -> wait -> delete one by one.

    const originalTitle = "Link in Bio";
    const targetTitle = `@${data.username}`; // Using username as display name logic
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const animateTitle = () => {
      if (!isDeleting) {
        // Typing
        if (currentIndex <= targetTitle.length) {
          document.title = targetTitle.substring(0, currentIndex);
          currentIndex++;
          timeoutId = setTimeout(animateTitle, 300); // Typing speed
        } else {
          // Done typing, wait before deleting
          isDeleting = true;
          timeoutId = setTimeout(animateTitle, 3000); // Stay visible for 3s
        }
      } else {
        // Deleting
        if (currentIndex >= 1) { // Stop at '@' or empty? User said "@ stop ho jaye" meaning wait at @?
          // User: "ek ek karke remove ... h remove ... s remove ... @ per stop ho jaye and fir se likhna suru kar de"
          // So delete until 1 char is left ('@')
          document.title = targetTitle.substring(0, currentIndex);
          currentIndex--;
          timeoutId = setTimeout(animateTitle, 200); // Deleting speed
        } else {
          // Done deleting, restart loop
          isDeleting = false;
          timeoutId = setTimeout(animateTitle, 500);
        }
      }
    };

    timeoutId = setTimeout(animateTitle, 1000);

    // Also set Favicon
    if (data.avatar) {
      const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = data.avatar;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    return () => clearTimeout(timeoutId);
  }, [data?.username, data?.avatar]);


  const fetchData = async () => {
    try {
      const res = await fetch(`http://fi1.bot-hosting.net:5945/api/${config.discordId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const jsonData = await res.json();
      setData(jsonData.data || jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setOverlayVisible(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.5;
      videoRef.current.play().catch(e => console.log("Video Play Error", e));
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    if (overlayVisible) return;

    if (isFeaturedAudioPlaying) {
      videoRef.current.muted = true;
    } else {
      if (!bgMuted) {
        videoRef.current.muted = false;
      }
    }
  }, [isFeaturedAudioPlaying, overlayVisible, bgMuted]);

  const toggleBgMute = () => {
    setBgMuted(!bgMuted);
    if (videoRef.current) {
      videoRef.current.muted = !bgMuted;
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Background Media - FORCE COVER */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        {config.background.type === "video" ? (
          <video
            ref={videoRef}
            src={config.background.url}
            autoPlay
            loop
            muted
            playsInline
            // Use object-cover with explicit pixel checking via viewport units if needed, but min-w-full usually works
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <img
            src={config.background.url}
            alt="Background"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Global Mute Button */}
      {!overlayVisible && (
        <button
          onClick={toggleBgMute}
          className="fixed top-4 right-4 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          style={{ color: config.themeColor, borderColor: config.themeColor }}
        >
          {bgMuted || isFeaturedAudioPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* Overlay */}
      {overlayVisible && <Overlay onEnter={handleEnter} />}

      {/* Main Profile Card */}
      {!overlayVisible && (
        <div className="z-10 relative w-full h-screen flex items-center justify-center p-4 overflow-y-auto">
          <ProfileCard
            data={data}
            loading={!data}
            featuredAudioUrl={config.audio?.url}
            onAudioPlayHelper={setIsFeaturedAudioPlaying}
          />
        </div>
      )}
    </main>
  );
}
