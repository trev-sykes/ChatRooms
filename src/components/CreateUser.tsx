import { useState } from "react";
import { useUser } from "../context/UserContext";
import { PageWrapper } from "./layout/PageWrapper";
import { TextInput } from "./input/TextInput";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "./button/Button";
import { BackgroundOrbs } from "./BackgroundOrbs";

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
            const res = await fetch("https://chatrooms-bspq.onrender.com/auth/create", {
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
        <PageWrapper centered>
            {/* Background Orbs */}
            <BackgroundOrbs variant="auth" />
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

                            <Button
                                type="submit"
                                variant="cta"
                                loading={loading}
                                loadingText="Creating Account..."
                            >
                                Sign Up
                            </Button>

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
