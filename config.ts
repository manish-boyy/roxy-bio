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

    // Custom Badges (Overrides Discord API badges)
    customBadges: [
        "https://discordresources.com/img/subscriptions/silver.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/b5/Discord_Active_Developer_Badge.svg",
        "https://discordresources.com/img/quest.png",
        "https://discordresources.com/img/username.png",
        "https://cdn.discordapp.com/badge-icons/83d8a1eb09a8d64e59233eec5d4d5c2d.png",
        "https://discordresources.com/img/hypesquadbrilliance.svg",
        "https://discordresources.com/img/boosts/discordboost3.svg",
    ],
    badgeStyle: {
        size: 24, // px
        opacity: 100, // 0-100 %
        gap: 8, // px
    },

    socials: [
        { label: "Github", iconUrl: "https://simpleicons.org/icons/github.svg", href: "https://github.com/manishbhaiii" },
        { label: "Discord", iconUrl: "https://simpleicons.org/icons/discord.svg", href: "https://roxylink.vercel.app/discord" },
        { label: "Instagram", iconUrl: "https://simpleicons.org/icons/youtube.svg", href: "https://www.youtube.com/@manish_boyy" },
    ],

    // Background media
    background: {
        type: "video", // 'video' or 'image'
        url: "https://cdn.discordapp.com/attachments/1270624795549106227/1467429113856917584/youtube-RFY9RALv5XE.mp4?ex=6984f69c&is=6983a51c&hm=dfe98f3fef3807d38d3e9ffa2c0b74a367749c81074eb3e06df6e88442df9cff&", // Placeholder - User to replace
    },
};
