import React from "react";

type UserCardProps = {
    username: string;
    profilePicture?: string;
    onClick?: () => void;
};

export const UserCard: React.FC<UserCardProps> = ({
    username,
    profilePicture,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="
        flex items-center gap-3
        p-3 px-4
        rounded-xl
        cursor-pointer
        transition duration-200 ease-in-out transform
        hover:bg-gray-100 hover:-translate-y-0.5
      "
        >
            <img
                src={profilePicture || "https://placehold.co/80x80"}
                alt={username}
                className="w-12 h-12 rounded-xl object-cover"
            />
            <p className="text-base font-medium text-gray-800">{username}</p>
        </div>
    );
};
