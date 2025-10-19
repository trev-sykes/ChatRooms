
export interface Message {
    id: number;
    text: string;
    type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
    sender?: {
        id: number;
        username: string;
        profilePicture?: string;
    };
    createdAt: string;
}
