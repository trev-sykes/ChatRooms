import { useState } from "react";
import { useUser } from "../context/UserContext";
import { PageWrapper } from "./layout/PageWrapper";
import { TextInput } from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";
import { Button } from "./ui/Button";
import { GoogleLogin } from "@react-oauth/google";
import { createUser } from "../api/auth";
import { Loader } from "./ui/Loader";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useLoadingToast } from "../hooks/useLoadingToast";
import { LoadingToast } from "./toasts/LoadingToast";

export const SignUp: React.FC = () => {
    const { login, loadingUser } = useUser();
    const navigate = useNavigate();

    // Hook for Google sign-in logic
    const {
        loading: googleLoading,
        error: googleError,
        handleGoogleAuth,
    } = useGoogleAuth("/welcome");

    // Local state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {
        isOpen: showLoadingToast,
        start: startLoadingToast,
        stop: stopLoadingToast,
        message: loadingMessage,
    } = useLoadingToast(6000);
    const isLoading = loading || googleLoading;
    const combinedStatus = status || googleError;

    /**
     * Handles normal form signup
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        startLoadingToast();

        try {
            await createUser(username, password, profilePicture);
            await login(username, password);
            setStatus("Account created successfully!");

            // Wait until user is fully loaded in context before navigating
            const waitForUser = () =>
                new Promise<void>((resolve) => {
                    const interval = setInterval(() => {
                        if (!loadingUser) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });

            await waitForUser();
            navigate("/welcome", { state: { redirect: true } });
        } catch (err: any) {
            setStatus(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <PageWrapper centered centeringOptions>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-xl">
                    <CardHeader>
                        <h1 className="text-3xl font-bold text-center text-text">
                            Create Your Account
                        </h1>
                    </CardHeader>

                    <CardContent>
                        {combinedStatus && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`mt-4 text-sm text-center ${combinedStatus.toLowerCase().includes("error") ||
                                    combinedStatus.toLowerCase().includes("wrong") ||
                                    combinedStatus.toLowerCase().includes("failed")
                                    ? "text-accent-red"
                                    : "text-accent-green"
                                    }`}
                            >
                                {combinedStatus}
                            </motion.p>
                        )}

                        {/* Google Sign-up */}
                        <div className="relative flex justify-center mb-4">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                    <Loader />
                                </div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleAuth}
                                    onError={() => setStatus("Google sign-up failed.")}
                                    useOneTap={false}
                                    auto_select={false}
                                    theme="outline" // or "outline", "filled_black"
                                    size="large" // or "medium", "small"
                                    text="signup_with" // or "signup_with", "continue_with", "signin"
                                    shape="pill" // or "pill", "circle", "square"
                                    logo_alignment="left" // or "center"
                                    width="300" // specify width in pixels
                                />
                            )}
                        </div>

                        <div className="my-4 flex items-center justify-center text-text-muted text-sm">
                            {!isLoading && <span className="px-2">or</span>}
                        </div>

                        {/* Regular signup form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <TextInput
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                disabled={isLoading}
                            />

                            <TextInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                type="password"
                                disabled={isLoading}
                            />

                            <TextInput
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                placeholder="Profile Picture URL (optional)"
                                disabled={isLoading}
                            />

                            <Button
                                type="submit"
                                variant="cta"
                                loading={isLoading}
                                loadingText="Creating Account..."
                            >
                                Sign Up
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter>
                        <p className="w-full text-sm text-text-muted text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-accent-blue hover:underline">
                                Log in
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
