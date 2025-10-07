import React, { useRef } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./Card";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-md px-4 py-6"
            onClick={handleOverlayClick}
        >
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            >
                <Card className="max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    {title && (
                        <CardHeader className="flex justify-between items-center">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-100">{title}</h3>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <X
                                    className="w-6 h-6 text-gray-300 cursor-pointer hover:text-gray-100 transition-colors duration-200"
                                    onClick={onClose}
                                />
                            </motion.div>
                        </CardHeader>
                    )}

                    {/* Content */}
                    <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
                        {children}
                    </CardContent>

                    {/* Optional Footer */}
                    {footer && (
                        <CardFooter className="flex justify-end gap-2 p-4 sm:p-6">
                            {footer}
                        </CardFooter>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};
