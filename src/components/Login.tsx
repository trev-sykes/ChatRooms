import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TextInput } from "../components/input/TextInput";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";

export const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const { login } = useUser();
    const navigate = useNavigate();

    const handleLogin = async () => {
        localStorage.removeItem("token");
        setError(null);
        try {
            await login(username, password);
            navigate("/"); // redirect to home on success
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        }
    };

    return (
        <PageWrapper centered >
            {/* Background Orbs */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute w-[25rem] h-[25rem] bg-indigo-500/20 rounded-full blur-3xl top-16 -left-20 z-0"
            />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="absolute w-[20rem] h-[20rem] bg-purple-500/20 rounded-full blur-3xl bottom-10 -right-16 z-0"
            />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-xl">
                    <CardHeader>
                        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm mb-4 text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="space-y-4">
                            <TextInput
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                            <TextInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                type="password"
                            />
                        </div>

                        <motion.button
                            onClick={handleLogin}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all"
                        >
                            Log In
                        </motion.button>
                    </CardContent>

                    <CardFooter>
                        <p className="w-full text-sm text-gray-300 text-center">
                            Don’t have an account?{" "}
                            <Link to="/create" className="text-indigo-400 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </PageWrapper>
    );
};
