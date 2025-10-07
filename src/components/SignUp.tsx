import { useState } from "react";
import { useUser } from "../context/UserContext";
import { PageWrapper } from "./layout/PageWrapper";
import { TextInput } from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";
import { Button } from "./ui/Button";
import { BackgroundOrbs } from "./ui/BackgroundOrbs";
import { GoogleLogin } from "@react-oauth/google";
import { createUser } from "../api/auth";
import axios from "axios";

export const SignUp: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Component state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login, loginWithGoogle } = useUser();
    const navigate = useNavigate();

    /**
     * Handles Google Sign-In for account creation
     */
    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setStatus(null);

        try {
            const { credential } = credentialResponse;

            if (!credential) {
                throw new Error("No credential received from Google");
            }

            // Send credential to backend for signup/login
            const res = await axios.post(
                `${apiUrl}/auth/google`,
                { credential },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { token, user } = res.data;

            if (!token) {
                throw new Error("No token received from server");
            }

            // Log in with Google credentials
            loginWithGoogle(token, user);

            // Redirect to home
            navigate("/home");
        } catch (error: any) {
            console.error("Google sign-up failed:", error);
            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.message
                || "Google sign-up failed. Please try again.";

            setStatus(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles form submission to create a new user account.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await createUser(username, password, profilePicture);
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
            <BackgroundOrbs variant="auth" />

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
                                    status.toLowerCase().includes("wrong") ||
                                    status.toLowerCase().includes("failed")
                                    ? "text-red-400"
                                    : "text-green-400"
                                    }`}
                            >
                                {status}
                            </motion.p>
                        )}

                        {/* Google Sign-In Button */}
                        <div className="flex justify-center mb-4">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setStatus("Google sign-up failed.")}
                                useOneTap={false}
                                auto_select={false}
                            />
                        </div>

                        <div className="my-4 flex items-center justify-center text-gray-400 text-sm">
                            <span className="px-2">or</span>
                        </div>

                        {/* Traditional signup form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <TextInput
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                disabled={loading}
                            />

                            <TextInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                type="password"
                                disabled={loading}
                            />

                            <TextInput
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                placeholder="Profile Picture URL (optional)"
                                disabled={loading}
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