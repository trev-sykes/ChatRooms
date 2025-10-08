import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Switch = ({ checked = false, onCheckedChange }: SwitchProps) => {
    const [isOn, setIsOn] = useState(checked);

    useEffect(() => {
        setIsOn(checked);
    }, [checked]);

    const toggle = () => {
        const newValue = !isOn;
        setIsOn(newValue);
        onCheckedChange?.(newValue);
    };

    return (
        <div
            className={`w-12 h-6 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300 ${isOn ? "bg-indigo-500" : "bg-gray-500"
                }`}
            onClick={toggle}
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className="w-4 h-4 bg-white rounded-full shadow-md"
                style={{ x: isOn ? 24 : 0 }}
            />
        </div>
    );
};
