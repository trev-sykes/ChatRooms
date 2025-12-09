import { useState, useEffect } from "react";
import { MessageCircle, Users, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PageWrapper } from "./layout/PageWrapper";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Quick fade-in
        const timer = setTimeout(() => setIsVisible(true), 100);

        // Subtle, professional confetti
        const confettiTimer = setTimeout(() => {
            const duration = 1200; // shorter duration
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 3,           // fewer particles
                    startVelocity: 15,          // moderate launch
                    gravity: 0.6,
                    ticks: 200,
                    origin: { x: Math.random(), y: 0 },
                    colors: ["#818cf8", "#a78bfa", "#c084fc"],
                    scalar: 0.7,                // smaller particles
                    drift: 0.1                  // minimal drift
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        }, 400);

        return () => {
            clearTimeout(timer);
            clearTimeout(confettiTimer);
        };
    }, []);


    const features = [
        { icon: <MessageCircle className="w-6 h-6 text-indigo-400" />, title: "Real-Time Messaging", description: "Instant messaging with WebSocket." },
        { icon: <Users className="w-6 h-6 text-indigo-400" />, title: "Group Chats", description: "Connect with multiple friends." },
        { icon: <Zap className="w-6 h-6 text-indigo-400" />, title: "Typing Indicators", description: "See when others are typing." },
        { icon: <Shield className="w-6 h-6 text-indigo-400" />, title: "Secure & Private", description: "Industry-standard security." },
    ];

    const steps = [
        { title: "Welcome to ChatRooms! 🎉", description: "You're all set to start chatting. Let's show you around.", action: "Get Started" },
        { title: "What You Can Do", description: "Explore the powerful features that make ChatRooms special.", action: "Continue" },
        { title: "Ready to Chat?", description: "Start a new conversation or join existing ones from your home page.", action: "Go to Home" },
    ];

    const handleNext = () => {
        if (step < steps.length - 1) setStep(step + 1);
        else navigate("/home");
    };

    return (
        <PageWrapper centered centeringOptions>
            <div className="relative z-10 w-full max-w-5xl text-center">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl mb-4 md:mb-6"
                >
                    <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
                    className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                >
                    {steps[step].title}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                    className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8"
                >
                    {steps[step].description}
                </motion.p>

                {/* Step Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
                    className="flex justify-center mb-6 md:mb-8"
                >
                    {step === 0 && (
                        <div className="max-w-xl w-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 md:p-6 shadow-xl">
                            <p className="text-base md:text-lg text-gray-200">
                                Your account is ready! Start exploring ChatRooms and connect with friends.
                            </p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto w-full">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 md:p-4 shadow-lg hover:scale-[1.02] transition-transform duration-200"
                                >
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                                        <div className="text-left">
                                            <h4 className="text-white font-semibold text-sm md:text-base mb-0.5 md:mb-1">{f.title}</h4>
                                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{f.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="max-w-xl w-full bg-slate-800/40 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 md:p-6 shadow-xl">
                            <p className="text-base md:text-lg text-gray-200">
                                You're all set! Go to your home page to start chatting with your friends.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Footer Button */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                    onClick={handleNext}
                    className="px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 text-sm md:text-base"
                >
                    {steps[step].action}
                </motion.button>

                {/* Progress Dots */}
                {step !== 1 && (
                    <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 md:h-2 rounded-full transition-all ${i === step
                                    ? "w-8 md:w-10 bg-gradient-to-r from-indigo-500 to-purple-500"
                                    : "w-1.5 md:w-2 bg-slate-700"
                                    }`}
                            />
                        ))}
                    </div>
                )}
                <div style={{ marginBottom: '16px' }} />
            </div>
        </PageWrapper>
    );
}