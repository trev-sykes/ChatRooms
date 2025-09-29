import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TextInput } from "../components/input/TextInput";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "./button/Button";
import { BackgroundOrbs } from "./BackgroundOrbs";

/**
 * Login page component for user authentication
 */
export const Login: React.FC = () => {
    // Form state
    const [username, setUsername] = useState<string>(""); // Stores the username input
    const [password, setPassword] = useState<string>(""); // Stores the password input

    // UI state
    const [error, setError] = useState<string | null>(null); // Stores error messages for display
    const [loginLoading, setLoginLoading] = useState<boolean>(false); // Indicates login in progress

    // Authentication context
    const { login } = useUser();

    // Navigation for redirecting on successful login
    const navigate = useNavigate();

    /**
     * Handles the login process when the user clicks the "Log In" button
     * - Clears any existing token from localStorage
     * - Resets error state
     * - Sets loading state during async operation
     * - Calls the login function from context
     * - Redirects to home page on success
     * - Displays error messages on failure
     */
    const handleLogin = async () => {
        localStorage.removeItem("token"); // Clear any stale token
        setError(null); // Reset previous errors
        setLoginLoading(true); // Show loading state

        try {
            await login(username, password); // Attempt login via context function
            navigate("/"); // Redirect to home on successful login
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again."); // Display error message
        } finally {
            setLoginLoading(false); // Reset loading state
        }
    };

    return (
        <PageWrapper centered>
            {/* Background visual elements for the login page */}
            <BackgroundOrbs variant="login" />

            {/* Login Card container with animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-xl">
                    {/* Card header */}
                    <CardHeader>
                        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                    </CardHeader>

                    {/* Card content */}
                    <CardContent>
                        {/* Display error messages if any */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm mb-4 text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Input fields */}
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

                        {/* Login button */}
                        <Button
                            variant="login"
                            onClick={handleLogin}
                            loading={loginLoading}
                            loadingText="Logging In..."
                        >
                            Log In
                        </Button>
                    </CardContent>

                    {/* Card footer */}
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
