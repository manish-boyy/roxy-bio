export const config = {
    description: `simping for 2d girls`,
    discordId: "1123856956780728411", // Use a valid ID to test
    themeColor: "#6f00ffff", // Hex color for the website theme
    spotify: true,

    ui: {
        mainCard: {
            opacity: 20, // 0-100 % (Transparency level)
            border: {
                show: false,
                width: 1, // pixels
                color: "#ffffff"
            }
        },
        activityCard: {
            opacity: 25, // 0-100 % (Background transparency)
            border: {
                show: true,
                width: 2, // pixels
                color: "#6f00ffff"
            }
        }
    },

    // Links: label, icon (from lucide-react), url
    socials: [
        { label: "Github", href: "https://github.com/your-username" },
        { label: "Discord", href: "https://discord.com/users/1213822891448209478" },
        { label: "instagram", href: "https://instagram.com/your-username" },
        { label: "website", href: "https://your-website.com" },
    ],

    // Background media
    background: {
        type: "video", // 'video' or 'image'
        url: "/asset/bg.mp4", // Placeholder - User to replace
    },
};
