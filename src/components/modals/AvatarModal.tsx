import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button";
import { TextInput } from "../ui/TextInput";
import { avatarOptions } from "../../utils/avatarOptions";
import { getAvatarUrl } from "../../utils/avatars";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
interface AvatarModalProps {
    isModalOpen: boolean;
    onChange: any;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({ isModalOpen, onChange }) => {
    const { user, updateAvatar } = useUser();
    const [avatarUrl, setAvatarUrl] = useState("");
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={() => onChange(false)}
            title="Update Avatar"
        >
            <div className="grid grid-cols-4 gap-4 mb-4">
                {avatarOptions.map((option) => (
                    <button
                        key={option.name}
                        onClick={() => {
                            const randomAvatar = getAvatarUrl(undefined, option.name, user?.username);
                            updateAvatar(randomAvatar, option.name);
                            onChange(false);
                        }}
                        className="w-16 h-16 rounded-full overflow-hidden border-2 hover:border-indigo-500 transition-colors duration-200"
                    >
                        <img
                            src={option.preview || 'https://i.pravatar.cc/100?u=preview18'}
                            alt={option.name}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
            <TextInput
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Custom Avatar URL"
                className="mb-2"
            />
            <Button
                onClick={() => {
                    updateAvatar(avatarUrl);
                    onChange(false);
                }}
                variant="primary"
                className="w-full"
            >
                Update
            </Button>
        </Modal>
    )
}