import { useState, useEffect } from "react";
import { MessageCircle, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "./layout/PageWrapper";

export default function Welcome() {
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        { icon: <MessageCircle className="w-12 h-12" />, title: "Real-Time Messaging", description: "Send and receive messages instantly with our blazing-fast WebSocket connection." },
        { icon: <Users className="w-12 h-12" />, title: "Group Conversations", description: "Create and join group chats to stay connected with multiple friends at once." },
        { icon: <Zap className="w-12 h-12" />, title: "Typing Indicators", description: "See when others are typing and stay engaged in real-time conversations." },
        { icon: <Shield className="w-12 h-12" />, title: "Secure & Private", description: "Your messages are protected with industry-standard security measures." }
    ];

    const steps = [
        { title: "Welcome to ChatRooms! 🎉", description: "You're all set to start chatting. Let's show you around.", action: "Get Started" },
        { title: "What You Can Do", description: "Explore the powerful features that make ChatRooms special.", action: "Continue" },
        { title: "Ready to Chat?", description: "Start a new conversation or join existing ones from your home page.", action: "Go to Home" }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) setStep(step + 1);
        else navigate('/home');
    };

    return (
        <PageWrapper centered centeringOptions>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className={`max-w-6xl w-full relative z-10 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        {steps[step].title}
                    </h1>
                    <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
                        {steps[step].description}
                    </p>
                </div>

                {/* Content Section */}
                <div className="mb-12">
                    {step === 0 && (
                        <div className="text-center space-y-8 py-12">
                            <div className="inline-block px-8 py-4 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl backdrop-blur-sm">
                                <p className="text-xl text-gray-200">
                                    Your account is ready! Start exploring ChatRooms and connect with friends.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
                                >
                                    <div className="text-indigo-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {f.icon}
                                    </div>
                                    <h4 className="text-white font-bold text-2xl mb-3">{f.title}</h4>
                                    <p className="text-gray-300 text-lg leading-relaxed">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center space-y-8 py-12">
                            <div className="inline-block px-8 py-4 bg-green-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
                                <p className="text-xl text-gray-200">
                                    You're all set! Go to your home page to start chatting with your friends.
                                </p>
                            </div>
                            <div className="flex justify-center gap-4 mt-8">
                                <div className="px-6 py-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                    <span className="text-gray-300">Step {step + 1} of {steps.length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleNext}
                        className="group flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                        {steps[step].action}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-3 mt-12">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === step
                                ? 'w-12 bg-gradient-to-r from-indigo-500 to-purple-500'
                                : 'w-2 bg-slate-700'
                                }`}
                        />
                    ))}
                </div>
                <div style={{ marginBottom: "16px" }} />
            </div>
        </PageWrapper>
    );
}