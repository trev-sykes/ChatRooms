// src/utils/avatarOptions.ts
export interface AvatarOption {
    name: string;       // style string used in getAvatarUrl
    preview: string;    // image to display as a button
}

export const avatarOptions: AvatarOption[] = [
    {
        name: "adventurer",
        preview: "https://api.dicebear.com/6.x/adventurer/svg?seed=preview1"
    },
    {
        name: "adventurer-neutral",
        preview: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=preview2"
    },
    {
        name: "avataaars",
        preview: "https://api.dicebear.com/6.x/avataaars/svg?seed=preview3"
    },
    {
        name: "bottts",
        preview: "https://api.dicebear.com/6.x/bottts/svg?seed=preview4"
    },
    {
        name: "croodles",
        preview: "https://api.dicebear.com/6.x/croodles/svg?seed=preview5"
    },
    {
        name: "croodles-neutral",
        preview: "https://api.dicebear.com/6.x/croodles-neutral/svg?seed=preview6"
    },
    {
        name: "rings",
        preview: "https://api.dicebear.com/9.x/rings/svg?seed=preview7"
    },
    {
        name: "identicon",
        preview: "https://api.dicebear.com/6.x/identicon/svg?seed=preview8"
    },
    {
        name: "initials",
        preview: "https://api.dicebear.com/6.x/initials/svg?seed=preview9"
    },
    {
        name: "micah",
        preview: "https://api.dicebear.com/6.x/micah/svg?seed=preview10"
    },
    {
        name: "miniavs",
        preview: "https://api.dicebear.com/6.x/miniavs/svg?seed=preview11"
    },
    {
        name: "open-peeps",
        preview: "https://api.dicebear.com/6.x/open-peeps/svg?seed=preview12"
    },
    {
        name: "personas",
        preview: "https://api.dicebear.com/6.x/personas/svg?seed=preview13"
    },
    {
        name: "pixel-art",
        preview: "https://api.dicebear.com/6.x/pixel-art/svg?seed=preview14"
    },
    {
        name: "pixel-art-neutral",
        preview: "https://api.dicebear.com/6.x/pixel-art-neutral/svg?seed=preview15"
    },
    {
        name: "thumbs",
        preview: "https://api.dicebear.com/6.x/thumbs/svg?seed=preview16"
    },
    {
        name: "fun-emoji",
        preview: "https://api.dicebear.com/6.x/fun-emoji/svg?seed=preview17"
    },
    {
        name: "pravatar",
        preview: "https://i.pravatar.cc/100?u=preview18"
    }
];
