import { motion } from "framer-motion";

export const Logo = () => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-3 select-none"
    >
        <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white text-2xl sm:text-3xl font-bold tracking-wide"
        >
            Chat<span className="text-indigo-400">Rooms</span>
        </motion.h1>
    </motion.div>
);
