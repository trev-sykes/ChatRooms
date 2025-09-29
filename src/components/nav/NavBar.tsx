import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowLeft } from "lucide-react";
import { useUser } from "../../context/UserContext";
import logo from "../../../public/favicon.png";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [conversationName, setConversationName] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user, logout } = useUser();

    const navItems = user
        ? [
            { to: "/home", label: "Home" },
            { to: "#", label: "Logout", onClick: logout },
        ]
        : [
            { to: "/home", label: "Home" },
            { to: "/login", label: "Login" },
            { to: "/create", label: "Sign Up" },
        ];

    const isConversationPage = location.pathname.startsWith("/conversation/");
    const conversationId = isConversationPage
        ? Number(location.pathname.split("/conversation/")[1])
        : null;

    useEffect(() => {
        if (!isConversationPage || !token || !conversationId) {
            setConversationName(null);
            return;
        }

        const fetchConversationName = async () => {
            try {
                const res = await fetch(`${BASE_URL}/conversations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    const conversation = data.conversations.find(
                        (conv: any) => conv.id === conversationId
                    );
                    setConversationName(
                        conversation?.name ||
                        conversation.users
                            .filter((u: any) => u.id !== user?.id)
                            .map((u: any) => u.username)
                            .join(", ") ||
                        "Conversation"
                    );
                } else {
                    setConversationName("Conversation");
                }
            } catch (err) {
                console.error(err);
                setConversationName("Conversation");
            }
        };

        fetchConversationName();
    }, [isConversationPage, conversationId, token, user]);

    return (
        <nav className="sticky top-5 z-50 flex justify-center">
            <div className="w-[90%] md:w-[66%] bg-white/10 backdrop-blur-md rounded-2xl shadow-lg relative">
                <div className="flex justify-between items-center px-4 sm:px-6 h-14">
                    <NavLink
                        to="/"
                        className="text-lg font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex items-center gap-3 select-none"
                        >
                            <motion.img
                                src={logo}
                                alt="App Logo"
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg"
                                initial={{ rotate: -15, opacity: 0, scale: 0.8 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </motion.div>
                    </NavLink>

                    <div className="hidden md:flex space-x-6 items-center">
                        {isConversationPage && (
                            <button
                                onClick={() => navigate(-1)}
                                className="px-3 py-2 rounded-lg text-sm font-medium transition text-gray-200 hover:bg-white/10 hover:text-white flex items-center"
                            >
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                Back
                            </button>
                        )}
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={item.onClick}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive && !isConversationPage && item.to !== "#"
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                        : "text-gray-200 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        {isConversationPage && conversationName && (
                            <span className="text-sm font-medium text-white">
                                {conversationName}
                            </span>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6 text-white" />
                            ) : (
                                <Menu className="h-6 w-6 text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden absolute top-14 left-0 right-0 bg-black/90 backdrop-blur-md rounded-b-2xl shadow-lg z-50 px-2 pb-3 space-y-1">
                        {isConversationPage && (
                            <button
                                onClick={() => {
                                    navigate(-1);
                                    setIsOpen(false);
                                }}
                                className="block px-3 py-2 rounded-lg text-base font-medium transition text-gray-200 hover:bg-white/10 hover:text-white w-full text-left flex items-center"
                            >
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                Back
                            </button>
                        )}
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => {
                                    setIsOpen(false);
                                    if (item.onClick) item.onClick();
                                }}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-lg text-base font-medium transition ${isActive && !isConversationPage && item.to !== "#"
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                        : "text-gray-200 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        {isConversationPage && conversationName && (
                            <div className="px-3 py-2 text-base font-medium text-white">
                                {conversationName}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};