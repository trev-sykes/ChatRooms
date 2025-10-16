import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { UserSearchList } from "../ui/UserSearchList";

interface User {
    id: number;
    username: string;
    profilePicture?: string;
}

interface AddUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedUsers: number[];
    onSelectedUsersChange: (users: number[]) => void;
    onAdd: () => void;
    availableUsers?: User[];
}

export const AddUsersModal: React.FC<AddUsersModalProps> = ({
    isOpen,
    onClose,
    selectedUsers,
    onSelectedUsersChange,
    onAdd,
    availableUsers = [],
}) => {
    const toggleUserSelection = (id: number) => {
        onSelectedUsersChange(
            selectedUsers.includes(id)
                ? selectedUsers.filter(uid => uid !== id)
                : [...selectedUsers, id]
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Users"
            footer={
                <>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        disabled={!selectedUsers.length}
                    >
                        Add
                    </Button>
                </>
            }
        >
            <UserSearchList
                allUsers={availableUsers}
                selectedUserIds={selectedUsers}
                onToggleUser={toggleUserSelection}
            />
        </Modal>
    );
};