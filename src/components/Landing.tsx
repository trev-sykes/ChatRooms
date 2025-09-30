import { useUser } from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./button/Button";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardContent, CardFooter } from "./ui/Card";
import { BackgroundOrbs } from "./BackgroundOrbs";

export const Landing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user) return <Navigate to="/home" replace />;

    return (
        <PageWrapper centered>
            <BackgroundOrbs variant="chat" />
            <Card className="max-w-2xl w-full bg-transparent">
                <CardContent className="flex flex-col items-center text-center gap-4 p-4 sm:gap-6 sm:p-8">
                    {/* Wrapper for Headline and Hero Illustration */}
                    <div className="flex flex-row items-center justify-center gap-4 w-full sm:flex-col sm:gap-0">
                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                        >
                            Chat. Made Simple.
                        </motion.h1>

                        {/* Hero Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                            className="w-24 h-24 flex-shrink-0 sm:w-48 sm:h-48 sm:my-4"
                        >
                            <svg
                                viewBox="0 0 120 120"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                            >
                                {/* First bubble */}
                                <rect x="10" y="20" width="60" height="40" rx="8" fill="#6366F1" />
                                <rect x="20" y="30" width="40" height="6" rx="3" fill="#C7D2FE" />
                                <rect x="20" y="42" width="30" height="6" rx="3" fill="#C7D2FE" />

                                {/* Second bubble */}
                                <rect x="50" y="60" width="60" height="40" rx="8" fill="#10B981" />
                                <rect x="60" y="70" width="40" height="6" rx="3" fill="#D1FAE5" />
                                <rect x="60" y="82" width="30" height="6" rx="3" fill="#D1FAE5" />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-base sm:text-xl text-gray-300 leading-relaxed"
                    >
                        A modern messaging platform built with{" "}
                        <span className="font-semibold text-white">
                            React, Node, and PostgreSQL
                        </span>
                        . Fast. Secure. Developer-first.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3 w-full justify-center sm:gap-4"
                    >
                        <Button onClick={() => navigate("/login")}>Login</Button>
                        <Button variant="secondary" onClick={() => navigate("/create")}>
                            Sign Up
                        </Button>
                    </motion.div>
                </CardContent>

                <CardFooter className="text-center text-gray-300 flex flex-col sm:flex-row justify-center gap-2 text-sm sm:text-base">
                    Built with ❤️ by{" "}
                    <a
                        href="https://x.com/freshly_mulched"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500 underline transition-colors duration-200"
                    >
                        freshly_mulched
                    </a>
                    •{" "}
                    <a
                        href="https://github.com/trev-sykes/ChatRooms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-500 underline transition-colors duration-200"
                    >
                        Source Code
                    </a>
                    • Fullstack Dev
                </CardFooter>
            </Card>
        </PageWrapper>
    );
};