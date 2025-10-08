import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { Switch } from "../ui/Switch";
import { updateProfile } from "../../api/users";
import { useUser } from "../../context/UserContext";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user, token, setUser } = useUser();
    const [bio, setBio] = useState(user?.bio || "");
    const [isDiscoverable, setIsDiscoverable] = useState(user?.isDiscoverable ?? true);
    const [loading, setLoading] = useState(false);

    // Sync local state whenever user changes
    useEffect(() => {
        setBio(user?.bio || "");
        setIsDiscoverable(user?.isDiscoverable ?? true);
    }, [user]);

    const handleSave = async () => {
        if (!user || !token) return;
        setLoading(true);
        try {
            const updatedUser = await updateProfile(token, { bio, isDiscoverable });
            console.log("Updated user:", updatedUser);
            setUser(updatedUser);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                    <TextInput
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a bit about yourself..."
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Public Profile
                        </label>
                        <p className="text-xs text-gray-500">
                            {isDiscoverable
                                ? "Visible in search and public listings."
                                : "Hidden from search results."}
                        </p>
                    </div>
                    <Switch
                        checked={isDiscoverable}
                        onCheckedChange={setIsDiscoverable}
                    />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={loading}
                    variant="primary"
                    className="w-full"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </Modal>
    );
};
