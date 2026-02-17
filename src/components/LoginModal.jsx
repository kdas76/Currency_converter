import { useState } from "react";

function LoginModal({ onClose, onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        onLogin(email);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-2xl p-6
                   shadow-[0_16px_48px_rgba(0,0,0,0.5)] animate-[fadeSlideUp_0.3s_ease]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 text-white/50
                     flex items-center justify-center text-xs cursor-pointer
                     hover:bg-red-500/30 hover:text-red-300 transition-all"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-lg font-bold text-white mb-1">🔐 Login</h2>
                <p className="text-[0.7rem] text-white/40 mb-5">
                    Sign in to get more conversions
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-[0.65rem] font-semibold uppercase tracking-wider text-white/40 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            placeholder="john@gmail.com"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white
                         outline-none placeholder:text-white/20
                         focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(108,92,231,0.3)] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[0.65rem] font-semibold uppercase tracking-wider text-white/40 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="*******"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white
                         outline-none placeholder:text-white/20
                         focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(108,92,231,0.3)] transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="mt-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600
                       text-white font-bold text-sm cursor-pointer transition-all
                       hover:brightness-110 hover:shadow-[0_4px_16px_rgba(0,210,160,0.3)]
                       active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-[0.65rem] text-white/30 mt-4">
                    No real authentication(Frontend)
                </p>
            </div>
        </div>
    );
}

export default LoginModal;
