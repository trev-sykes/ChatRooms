import { useState } from "react";
import { useUser } from "../context/UserContext";
import { PageWrapper } from "./layout/PageWrapper";
import { TextInput } from "./input/TextInput";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";

export const CreateUser: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("http://localhost:4000/auth/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, profilePicture }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus(data.error || "Error creating account.");
                setLoading(false);
                return;
            }

            await login(username, password);
            setStatus("Account created successfully!");
        } catch (err: any) {
            setStatus(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper centered bgColor="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background Orbs */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute w-[28rem] h-[28rem] bg-indigo-500/20 rounded-full blur-3xl top-20 -left-28 z-0"
            />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="absolute w-[22rem] h-[22rem] bg-purple-500/20 rounded-full blur-3xl bottom-16 -right-20 z-0"
            />

            {/* Create Account Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-xl">
                    <CardHeader>
                        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Create Your Account
                        </h1>
                    </CardHeader>

                    <CardContent>
                        {status && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`mt-4 text-sm text-center ${status.toLowerCase().includes("error") ||
                                        status.toLowerCase().includes("wrong")
                                        ? "text-red-400"
                                        : "text-green-400"
                                    }`}
                            >
                                {status}
                            </motion.p>
                        )}

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

                            <TextInput
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                placeholder="Profile Picture URL (optional)"
                            />

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </motion.button>
                        </form>
                    </CardContent>

                    <CardFooter>
                        <p className="w-full text-sm text-gray-300 text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-indigo-400 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </PageWrapper>
    );
};
