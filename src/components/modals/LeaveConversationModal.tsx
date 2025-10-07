// LeaveConversationModal.tsx
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface LeaveConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    conversationName: string;
}

export const LeaveConversationModal: React.FC<LeaveConversationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    conversationName,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Leave Conversation?"
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
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Leave
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-3">
                <p className="text-gray-200">
                    Are you sure you want to leave <strong>{conversationName}</strong>?
                </p>
                <p className="text-sm text-gray-400">
                    You will no longer see messages in this conversation. This action cannot be undone.
                </p>
            </div>
        </Modal>
    );
};