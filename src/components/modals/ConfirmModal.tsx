import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useState } from "react";
interface ConfirmationModalProps {
    isOpen: any;
    title: string;
    action: string;
    description: string;
    onConfirm: any;
    onClose: any;
}
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, action, description, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose(null)}
            title={title}
            footer={
                <>
                    <Button variant="secondary" size="sm" onClick={() => onClose(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await onConfirm();
                                onClose(null);
                            } catch (err) {
                                console.error(err);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : action}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-3">
                <p className="text-gray-200">
                    {description}
                </p>
            </div>
        </Modal>
    )
}