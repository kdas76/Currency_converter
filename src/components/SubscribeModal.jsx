import { useState } from "react";

function SubscribeModal({ onClose, onSubscribe }) {
    const [selectedPlan, setSelectedPlan] = useState("monthly");

    const plans = [
        { id: "monthly", name: "Monthly", price: "₹199/mo", badge: "" },
        { id: "yearly", name: "Yearly", price: "₹1999/yr", badge: "Save 16.3%" },
    ];

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
                <h2 className="text-lg font-bold text-white mb-1">Subscription</h2>
                <p className="text-[0.7rem] text-white/40 mb-5">
                    Unlock unlimited currency conversions
                </p>

                {/* Features */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 space-y-2">
                    {["Unlimited conversions", "Historical date lookup", "Priority rate updates"].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs text-white/70">
                            <span className="text-emerald-400">✓</span>
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Plan selector */}
                <div className="flex gap-2 mb-4">
                    {plans.map((plan) => (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-all
                ${selectedPlan === plan.id
                                    ? "bg-purple-500/20 border-purple-500/40 shadow-[0_0_0_1px_rgba(108,92,231,0.3)]"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                                }`}
                        >
                            <div className="text-xs font-semibold text-white">{plan.name}</div>
                            <div className="text-sm font-bold text-purple-300 mt-0.5">{plan.price}</div>
                            {plan.badge && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[0.6rem] font-bold rounded-full">
                                    {plan.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Subscribe button */}
                <button
                    onClick={() => onSubscribe(selectedPlan)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600
                     text-white font-bold text-sm cursor-pointer transition-all
                     hover:brightness-110 hover:shadow-[0_4px_16px_rgba(108,92,231,0.4)]
                     active:scale-[0.98]"
                >
                    Subscribe Now
                </button>

                <p className="text-center text-[0.65rem] text-white/30 mt-4">
                    No real payment(frontend only)
                </p>
            </div>
        </div>
    );
}

export default SubscribeModal;
