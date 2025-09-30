import { useUser } from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./button/Button";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardContent, CardFooter } from "./ui/Card";

export const Landing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user) return <Navigate to="/home" replace />;

    return (
        <PageWrapper centered>
            <Card className="max-w-2xl w-full bg-transparent">
                <CardContent className="flex flex-col items-center text-center gap-6 p-8">
                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                    >
                        Chat. Made Simple.
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-lg sm:text-xl text-gray-300 leading-relaxed"
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
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                    >
                        <Button onClick={() => navigate("/login")}>Login</Button>
                        <Button variant="secondary" onClick={() => navigate("/create")}>
                            Sign Up
                        </Button>
                    </motion.div>
                </CardContent>

                <CardFooter className="text-center">
                    Built with ❤️ by Satoshi • Fullstack Dev
                </CardFooter>
            </Card>
        </PageWrapper >
    );
};
