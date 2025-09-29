// src/utils/avatars.ts
export const getAvatarUrl = (customUrl?: string, style?: string) => {
    if (customUrl) return customUrl;

    switch (style) {
        case "adventurer":
            return `https://api.dicebear.com/6.x/adventurer/svg?seed=${Math.random()}`;
        case "adventurer-neutral":
            return `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${Math.random()}`;
        case "avataaars":
            return `https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`;
        case "bottts":
            return `https://api.dicebear.com/6.x/bottts/svg?seed=${Math.random()}`;
        case "croodles":
            return `https://api.dicebear.com/6.x/croodles/svg?seed=${Math.random()}`;
        case "croodles-neutral":
            return `https://api.dicebear.com/6.x/croodles-neutral/svg?seed=${Math.random()}`;
        case "rings":
            return `https://api.dicebear.com/9.x/rings/svg?seed=${Math.random()}`;
        case "identicon":
            return `https://api.dicebear.com/6.x/identicon/svg?seed=${Math.random()}`;
        case "initials":
            return `https://api.dicebear.com/6.x/initials/svg?seed=${Math.random()}`;
        case "micah":
            return `https://api.dicebear.com/6.x/micah/svg?seed=${Math.random()}`;
        case "miniavs":
            return `https://api.dicebear.com/6.x/miniavs/svg?seed=${Math.random()}`;
        case "open-peeps":
            return `https://api.dicebear.com/6.x/open-peeps/svg?seed=${Math.random()}`;
        case "personas":
            return `https://api.dicebear.com/6.x/personas/svg?seed=${Math.random()}`;
        case "pixel-art":
            return `https://api.dicebear.com/6.x/pixel-art/svg?seed=${Math.random()}`;
        case "pixel-art-neutral":
            return `https://api.dicebear.com/6.x/pixel-art-neutral/svg?seed=${Math.random()}`;
        case "thumbs":
            return `https://api.dicebear.com/6.x/thumbs/svg?seed=${Math.random()}`;
        case "fun-emoji":
            return `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${Math.random()}`;
        default:
            return `https://i.pravatar.cc/100?u=${Math.random()}`;
    }
};
