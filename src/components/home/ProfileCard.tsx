import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Button } from "../ui/Button";

interface ProfileCardProps {
    user: {
        username: string;
        handle: string;
        profilePicture?: string;
        bio?: string;
        createdAt?: any;
    };
    onUpdateAvatar: () => void;
    onEditProfile: () => void;
    onLogout: () => void;
}

export const ProfileCard = ({
    user,
    onUpdateAvatar,
    onEditProfile,
    onLogout
}: ProfileCardProps) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-surface border border-border-dark rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text mb-6">Profile</h2>

                <div className="flex flex-col items-center gap-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-dark flex items-center justify-center shadow-lg">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://i.pravatar.cc/100?u=preview18';
                                }}
                            />
                        ) : (
                            <span className="text-3xl text-text font-bold">
                                {user.username[0].toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-text">
                            {user.username}
                        </h3>
                        {user.handle && user.handle !== user.username ? (
                            <p className="text-sm text-text-muted mt-1">@{user.handle}</p>
                        ) : (
                            <button
                                onClick={onEditProfile}
                                className="text-accent-blue text-sm font-semibold mt-1 hover:text-accent-blue-light transition-colors"
                            >
                                Add a handle
                            </button>
                        )}
                        {user.createdAt && (
                            <p className="text-sm text-text-muted mt-1">
                                Member since{" "}
                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        )}
                        {/* Bio Section */}
                        <div className="text-center mt-4">
                            {user.bio ? (
                                <p className="text-text-muted text-sm">{user.bio}</p>
                            ) : (
                                <button
                                    onClick={onEditProfile}
                                    className="text-accent-blue text-sm font-semibold hover:text-accent-blue-light transition-colors"
                                >
                                    Add a bio
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col gap-3">
                        <Button
                            variant="primary"
                            onClick={onUpdateAvatar}
                        >
                            Update Avatar
                        </Button>
                        <Button
                            onClick={onEditProfile}
                            variant="secondary"
                        >
                            Edit Profile
                        </Button>
                        <Button
                            onClick={onLogout}
                            variant="destructive"
                            className="w-full px-4 py-2 flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} /> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};