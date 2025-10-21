import { useState } from "react";
import { Button } from "../ui/Button";
import { setPasswordApi } from "../../api/auth";
import { useUser } from "../../context/UserContext";

export const SetPasswordModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { token, user, setUser } = useUser();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !user) return null;

    const handleSave = async () => {
        if (!token) return;

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await setPasswordApi(token, password);
            setUser({ ...user, needsPassword: false }); // remove the flag
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to set password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl w-96 text-white space-y-4">
                <h2 className="text-lg font-bold">Set a Password</h2>
                <p>This will allow you to log in with username/password as well as Google.</p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a new password"
                    className="w-full p-2 rounded bg-slate-700 text-white outline-none"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Set Password"}
                </Button>
            </div>
        </div>
    );
};
