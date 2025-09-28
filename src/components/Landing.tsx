import { useUser } from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./button/Button";
import { PageWrapper } from "./layout/PageWrapper";

export const Landing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user) return <Navigate to="/home" replace />;

    return (
        <PageWrapper centered>
            {/* Animated gradient orb */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-3xl top-20 -left-40"
            />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                className="absolute w-[25rem] h-[25rem] bg-purple-500/20 rounded-full blur-3xl bottom-10 -right-32"
            />
            {/* Headline */}
            <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="text-5xl sm:text-6xl font-extrabold tracking-tight text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
                Real-time Chat.
                <span className="block">Made Simple.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9 }}
                className="mt-6 text-lg sm:text-xl text-gray-300 text-center max-w-xl leading-relaxed"
            >
                A modern messaging platform built with <span className="font-semibold text-white">React, Node, and PostgreSQL</span>.
                Fast. Secure. Developer-first.
            </motion.p>

            {/* CTA card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
                <Button
                    onClick={() => navigate("/login")}
                >
                    Login
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => navigate("/create")}
                >
                    Sign Up
                </Button>
            </motion.div>

            {/* Footer */}
            <p className="absolute bottom-6 text-sm text-gray-400 text-center">
                Built with ❤️ by Satoshi • Fullstack Dev
            </p>
        </PageWrapper>
    );
};
