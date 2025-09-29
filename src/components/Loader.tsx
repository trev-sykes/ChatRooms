import { motion } from "framer-motion"
export const Loader = () => {
    return (
        <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center py-12"
        >
            <div className="flex space-x-2">
                <motion.span className="w-3 h-3 bg-white rounded-full" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                <motion.span className="w-3 h-3 bg-white rounded-full" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                <motion.span className="w-3 h-3 bg-white rounded-full" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
            </div>
        </motion.div>
    )
}