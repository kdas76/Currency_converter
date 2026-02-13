import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useHistoricalRates from "../hooks/useHistoricalRates";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
);

function RateChart({ fromCurrency, toCurrency, onClose }) {
    const { data, loading, error } = useHistoricalRates(
        fromCurrency,
        toCurrency
    );

    const chartData = {
        labels: data.map((d) => {
            const date = new Date(d.date);
            return date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
            });
        }),
        datasets: [
            {
                label: `${fromCurrency.toUpperCase()} → ${toCurrency.toUpperCase()}`,
                data: data.map((d) => d.rate),
                borderColor: "#6c5ce7",
                backgroundColor: "rgba(108, 92, 231, 0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#a29bfe",
                pointBorderColor: "#6c5ce7",
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 2.5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `12-Month Trend: ${fromCurrency.toUpperCase()} → ${toCurrency.toUpperCase()}`,
                color: "#f1f1f7",
                font: { size: 14, family: "Inter", weight: "600" },
                padding: { bottom: 16 },
            },
            tooltip: {
                backgroundColor: "rgba(15, 15, 26, 0.95)",
                titleColor: "#a29bfe",
                bodyColor: "#f1f1f7",
                borderColor: "rgba(108, 92, 231, 0.3)",
                borderWidth: 1,
                padding: 10,
                cornerRadius: 10,
                titleFont: { family: "Inter", weight: "600" },
                bodyFont: { family: "Inter" },
                callbacks: {
                    label: (ctx) => `Rate: ${ctx.parsed.y.toFixed(4)}`,
                },
            },
            legend: { display: false },
        },
        scales: {
            x: {
                ticks: { color: "rgba(255,255,255,0.4)", font: { size: 11, family: "Inter" } },
                grid: { color: "rgba(255,255,255,0.05)" },
                border: { color: "rgba(255,255,255,0.1)" },
            },
            y: {
                ticks: {
                    color: "rgba(255,255,255,0.4)",
                    font: { size: 11, family: "Inter" },
                    callback: (v) => v.toLocaleString(),
                },
                grid: { color: "rgba(255,255,255,0.05)" },
                border: { color: "rgba(255,255,255,0.1)" },
            },
        },
    };

    return (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl animate-[fadeSlideUp_0.4s_ease]">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white/70 tracking-wide uppercase">
                    Year Chart
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white/50 text-xs
                     hover:bg-red-500/30 hover:text-red-300 transition-all cursor-pointer"
                >
                    ✕
                </button>
            </div>

            {/* Chart body */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-3 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                    <span className="ml-3 text-sm text-white/40">Loading chart data...</span>
                </div>
            )}

            {error && (
                <div className="text-center py-8 text-red-400 text-sm">{error}</div>
            )}

            {!loading && !error && data.length > 0 && (
                <div className="h-64 sm:h-72">
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}

            {!loading && !error && data.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm">
                    No historical data available for this pair.
                </div>
            )}
        </div>
    );
}

export default RateChart;
