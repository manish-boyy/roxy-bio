"use client";

import { motion } from "framer-motion";
import { Github, Music, Gamepad2, Link as LinkIcon, Play, Pause, Eye } from "lucide-react";
import Image from "next/image";
import { config } from "@/config";
import { useState, useRef, useEffect } from "react";

// Type definitions for the API response
export interface DiscordData {
    username: string;
    avatar: string;
    activities: Activity[];
    status: string;
}

interface Activity {
    name: string;
    type: string;
    details?: string;
    state?: string;
    applicationId?: string;
    assets?: {
        largeImage?: string;
        smallImage?: string;
        largeText?: string;
        smallText?: string;
    };
    spotify?: {
        albumArt?: string;
        songName?: string;
        artistName?: string;
        trackURL?: string;
    };
    timestamps?: {
        start?: string;
        end?: string;
    };
}

interface ProfileCardProps {
    data: DiscordData | null;
    loading: boolean;
    featuredAudioUrl?: string;
    onAudioPlayHelper?: (playing: boolean) => void;
}

const statusColors: Record<string, string> = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
};

// Helper: Convert Hex to RGB for manual opacity
const hexToRgb = (hex: string) => {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
    return '255, 255, 255'; // Fallback
};


export default function ProfileCard({ data, loading, featuredAudioUrl, onAudioPlayHelper }: ProfileCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [views, setViews] = useState(0);

    useEffect(() => {
        // View Counter logic
        const stored = localStorage.getItem("profile_views");
        let count = stored ? parseInt(stored) : 0;
        count = count + 1;
        setViews(count);
        localStorage.setItem("profile_views", count.toString());
    }, []);

    useEffect(() => {
        if (onAudioPlayHelper) {
            onAudioPlayHelper(isPlaying);
        }
    }, [isPlaying, onAudioPlayHelper]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch((e) => console.error("Audio play error", e));
        }
        setIsPlaying(!isPlaying);
    };

    if (loading || !data) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ borderColor: `${config.themeColor}50`, color: config.themeColor }}
                className="w-[480px] h-[350px] bg-black/30 backdrop-blur-md rounded-xl border flex items-center justify-center transition-all duration-300"
            >
                <div
                    style={{ borderColor: config.themeColor, borderTopColor: 'transparent' }}
                    className="w-8 h-8 border-2 rounded-full animate-spin"
                />
            </motion.div>
        );
    }

    // --- LOGIC ---
    const getAvatarUrl = (url: string | undefined) => {
        if (!url) return "";
        const parts = url.split('/');
        const hash = parts[parts.length - 1].split('.')[0];
        if (hash.startsWith("a_")) {
            return url.replace(".png", ".gif").replace(".webp", ".gif").replace(".jpg", ".gif");
        }
        return url;
    };

    const avatarUrl = getAvatarUrl(data.avatar);

    const fixDiscordUrl = (url: string | undefined) => {
        if (!url) return null;
        if (url.includes("mp:attachments/")) {
            const parts = url.split("mp:attachments/");
            if (parts.length > 1) {
                let fixed = `https://cdn.discordapp.com/attachments/${parts[1]}`;
                if (fixed.endsWith(".png") && fixed.includes("?")) {
                    fixed = fixed.slice(0, -4);
                }
                return fixed;
            }
        }
        return url;
    };

    const spotify = data.activities.find((act) => act.name === "Spotify" || act.type === "Listening");
    const game = data.activities.find((act) => act.name !== "Spotify" && act.type !== "Listening" && act.name !== "Custom Status");

    // Choose one activity to show (Spotify priority)
    const currentActivity = spotify || game;

    const getActivityImage = (activity: Activity) => {
        if (activity.spotify?.albumArt) return activity.spotify.albumArt;
        if (activity.assets?.largeImage) {
            if (activity.assets.largeImage.startsWith("spotify:")) {
                const artId = activity.assets.largeImage.replace("spotify:", "");
                return `https://i.scdn.co/image/${artId}`;
            }
            if (activity.assets.largeImage.startsWith("http")) {
                return fixDiscordUrl(activity.assets.largeImage);
            }
        }
        return null;
    };

    // Dynamic RGB for rgba styles
    const themeRgb = hexToRgb(config.themeColor || '#ffffff');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 w-full w-[550px] bg-black/20 backdrop-blur-xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center gap-6"
            // Light shadow, glass feel
            style={{ boxShadow: `0 0 40px ${config.themeColor}10` }}
        >
            {/* View Counter - Bottom Left (as per image reference) */}
            <div className="absolute bottom-6 left-8 flex items-center gap-2 text-sm font-bold opacity-80 z-20">
                <Eye className="w-4 h-4" style={{ color: config.themeColor }} />
                <span style={{ color: config.themeColor }}>{views}</span>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center w-full z-10 relative">
                {/* Avatar with Wings Decoration */}
                <div className="relative flex items-center justify-center">
                    {/* Left Wing Emoji */}
                    <span className="text-3xl absolute -left-10 top-2 opacity-90 transform -rotate-12">🕊️</span>

                    <div className="relative group">
                        <Image
                            src={avatarUrl}
                            alt="Avatar"
                            width={100}
                            height={100}
                            unoptimized
                            className="rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300 object-cover"
                        // Removed border from avatar itself to match image cleaner look, or maybe user likes it? Keeping it simple.
                        />
                        <div
                            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black ${statusColors[data.status] || "bg-gray-500"}`}
                        />
                    </div>

                    {/* Right Wing Emoji */}
                    <span className="text-3xl absolute -right-10 top-2 opacity-90 transform rotate-12">🕊️</span>
                </div>

                {/* Username - Gothic Font */}
                <h1
                    style={{
                        textShadow: `0 0 15px ${config.themeColor}`,
                        color: config.themeColor,
                        fontFamily: 'var(--font-gothic), serif' // Using the CSS variable we set in global layout
                    }}
                    className="mt-4 text-5xl font-normal tracking-wider"
                >
                    {data.username}
                </h1>
            </div>

            {/* Custom Pill-Shaped Activity Card (The "Green" one) */}
            {currentActivity && (
                <div
                    className="w-full max-w-sm rounded-[30px] p-2 pr-2 flex items-center gap-3 relative overflow-hidden"
                    style={{
                        backgroundColor: `rgba(${themeRgb}, 0.25)`, // Stronger tint
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {/* Left: User Avatar (Small) */}
                    <div className="relative w-12 h-12 shrink-0 ml-2">
                        <Image
                            src={avatarUrl}
                            alt="mini-avatar"
                            fill
                            className="rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-black-900"></div>
                    </div>

                    {/* Middle: Text Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold text-sm truncate">{data.username}</span>
                            {/* Badge Icon */}
                            <span className="bg-purple-500/80 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">ROXY</span>
                        </div>
                        <p className="text-xs text-green-300 font-medium truncate">
                            {currentActivity.name === "Spotify" ? "Listening to Spotify" : `Playing ${currentActivity.name}`}
                        </p>
                        <p className="text-[10px] text-white/60 truncate">
                            {currentActivity.details || currentActivity.state || "Just lounging"}
                        </p>
                    </div>

                    {/* Right: Large Activity Image (Square) */}
                    <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-black/50">
                        {getActivityImage(currentActivity) ? (
                            <img src={getActivityImage(currentActivity)!} alt="Activity" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Gamepad2 className="w-6 h-6 text-white/50" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* If no activity, show a placeholder pill so height remains steady (Optional) */}
            {!currentActivity && (
                <div
                    className="w-full max-w-sm rounded-[30px] p-4 flex items-center justify-center gap-3 relative overflow-hidden"
                    style={{
                        backgroundColor: `rgba(${themeRgb}, 0.1)`,
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <span className="text-sm opacity-60 font-mono" style={{ color: config.themeColor }}>No Activity Detected</span>
                </div>
            )}

            {/* Social Icons - Glowing & Centered */}
            <div className="flex items-center justify-center gap-6 mt-2">
                {config.socials.map((social: any) => (
                    <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                        style={{
                            color: config.themeColor,
                            // Creating a glow effect behind the icon with box-shadow
                            filter: `drop-shadow(0 0 8px ${config.themeColor})`
                        }}
                    >
                        {social.label.toLowerCase() === "github" ? <Github className="w-8 h-8" /> :
                            social.label.toLowerCase() === "discord" ? <LinkIcon className="w-8 h-8" /> :
                                social.label.toLowerCase() === "spotify" ? <Music className="w-8 h-8" /> :
                                    social.label.toLowerCase() === "instagram" ? <div className="w-8 h-8 rounded-lg border-2 border-current p-1 flex items-center justify-center"><div className="w-3 h-3 bg-current rounded-full"></div></div> : /* Placeholder for IG */
                                        <LinkIcon className="w-8 h-8" />}
                    </a>
                ))}
            </div>

            {/* Featured Audio - Hidden (or minimal) as requested image doesn't show it prominently */}
            {/* Keeping it only if it plays sound, but hidden visually or very minimal if needed. 
                User said "design like this", and image has no audio player visible inside the card.
                However, there is a mute button in top-left of SCREEN.
                We'll hide the player UI inside the card to match, but keep audio logic.
            */}
            {featuredAudioUrl && (
                <div className="hidden">
                    <audio ref={audioRef} src={featuredAudioUrl} loop autoPlay />
                </div>
            )}

        </motion.div>
    );
}
