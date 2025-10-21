import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

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
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>

                <div className="flex flex-col items-center gap-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
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
                            <span className="text-3xl text-white font-bold">
                                {user.username[0].toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-white">
                            {user.username}
                        </h3>
                        {user.handle && user.handle !== user.username ? (
                            <p className="text-sm text-gray-500 mt-1">@{user.handle}</p>
                        ) : (
                            <button
                                onClick={onEditProfile}
                                className="text-indigo-400 text-sm font-semibold mt-1 hover:text-indigo-300 transition-colors"
                            >
                                Add a handle
                            </button>
                        )}
                        {user.createdAt && (
                            <p className="text-sm text-gray-400 mt-1">
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
                                <p className="text-gray-300 text-sm">{user.bio}</p>
                            ) : (
                                <button
                                    onClick={onEditProfile}
                                    className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
                                >
                                    Add a bio
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col gap-3">
                        <button
                            onClick={onUpdateAvatar}
                            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            Update Avatar
                        </button>
                        <button
                            onClick={onEditProfile}
                            className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={onLogout}
                            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};