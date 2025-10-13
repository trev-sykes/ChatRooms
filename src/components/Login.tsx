import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TextInput } from "./ui/TextInput";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";
import { useLoadingToast } from "../hooks/useLoadingToast";
import { LoadingToast } from "./toasts/LoadingToast";
import { Button } from "./ui/Button";
import { BackgroundOrbs } from "./ui/BackgroundOrbs";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

/**
 * Login page component for user authentication
 */
export const Login: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { isOpen: showLoadingToast, start: startLoadingToast, stop: stopLoadingToast, message: loadingMessage } = useLoadingToast(6000);

    // Form state
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // UI state
    const [error, setError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    // Authentication context
    const { login, loginWithGoogle } = useUser();

    // Navigation for redirecting on successful login
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoginLoading(true);
        setError(null);

        try {
            const { credential } = credentialResponse;

            if (!credential) {
                throw new Error("No credential received from Google");
            }

            // Send credential to backend
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

            // Extract token and user from response
            const { token, user } = res.data;

            if (!token) {
                throw new Error("No token received from server");
            }

            // Use the new loginWithGoogle function instead!
            loginWithGoogle(token, user);

            // Redirect after success
            navigate("/home");
        } catch (error: any) {
            console.error("Google login failed:", error);
            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.message
                || "Google login failed. Please try again.";

            setError(errorMessage);
        } finally {
            setLoginLoading(false);
            stopLoadingToast();
        }
    };

    /**
     * Handles the login process when the user clicks the "Log In" button
     */
    const handleLogin = async () => {
        localStorage.removeItem("token");
        setError(null);
        setLoginLoading(true);
        startLoadingToast();

        try {
            await login(username, password);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoginLoading(false);
            stopLoadingToast();
        }
    };

    return (
        <PageWrapper centered>
            <BackgroundOrbs variant="login" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-xl">
                    <CardHeader>
                        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
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

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google sign-in failed.")}
                                useOneTap={false}
                                auto_select={false}
                                disabled={loginLoading}
                            />
                        </div>
                        <div className="my-4 flex items-center justify-center text-gray-400 text-sm">
                            <span className="px-2">or</span>
                        </div>

                        <form className="space-y-4">
                            <TextInput
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                disabled={loginLoading}
                            />
                            <TextInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                type="password"
                                disabled={loginLoading}
                            />

                            <Button
                                variant="login"
                                onClick={handleLogin}
                                loading={loginLoading}
                                loadingText="Logging In..."
                            >
                                Log In
                            </Button>
                        </form>

                        <div className="my-4 flex items-center justify-center text-gray-400 text-sm">
                            <span className="px-2">or</span>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <p className="w-full text-sm text-gray-300 text-center">
                            Don't have an account?{" "}
                            <Link to="/create" className="text-indigo-400 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
            <LoadingToast
                isOpen={showLoadingToast}
                onClose={stopLoadingToast}
                title={loadingMessage.title}
                message={loadingMessage.body}
            />
        </PageWrapper>
    );
};