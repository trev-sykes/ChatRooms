import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TextInput } from "../components/input/TextInput";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "./button/Button";
import { BackgroundOrbs } from "./BackgroundOrbs";

export const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const { login } = useUser();
    const navigate = useNavigate();

    const handleLogin = async () => {
        localStorage.removeItem("token");
        setError(null);
        setLoginLoading(true);
        try {
            await login(username, password);
            navigate("/"); // redirect to home on success
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <PageWrapper centered >
            {/* Background Orbs */}
            <BackgroundOrbs variant="login" />

            {/* Login Card */}
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
                        <Button
                            variant="login"
                            onClick={handleLogin}
                            loading={loginLoading}
                            loadingText="Logging In..."
                        >
                            Log In
                        </Button>
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
