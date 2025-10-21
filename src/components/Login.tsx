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
import { Loader } from "./ui/Loader";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

/**
 * Login page component for user authentication
 */
export const Login: React.FC = () => {
    const { login } = useUser();
    const navigate = useNavigate();

    const {
        loading: googleLoading,
        error: googleError,
        handleGoogleAuth,
    } = useGoogleAuth("/home");

    const {
        isOpen: showLoadingToast,
        start: startLoadingToast,
        stop: stopLoadingToast,
        message: loadingMessage,
    } = useLoadingToast(6000);

    // Form state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // UI state
    const [error, setError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);

    const isLoading = loginLoading || googleLoading;
    const combinedError = error || googleError;

    /**
     * Handles normal username/password login
     */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <PageWrapper centered centeringOptions>
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
                        {combinedError && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm mb-4 text-center"
                            >
                                {combinedError}
                            </motion.p>
                        )}

                        <div className="relative flex justify-center mb-4">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                    <Loader />
                                </div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleAuth}
                                    onError={() => setError("Google sign-in failed.")}
                                    useOneTap={false}
                                    auto_select={false}
                                />
                            )}
                        </div>

                        <div className="my-4 flex items-center justify-center text-gray-400 text-sm">
                            {!isLoading && <span className="px-2">or</span>}
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
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

                            <Button
                                type="submit"
                                variant="login"
                                loading={isLoading}
                                loadingText="Logging In..."
                            >
                                Log In
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter>
                        <p className="w-full text-sm text-gray-300 text-center">
                            Don&apos;t have an account?{" "}
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
