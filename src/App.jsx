import { useState } from "react";
import InputBox from "./components/InputBox";
import RateChart from "./components/RateChart";
import useCurrencyInfo from "./hooks/useCurrencyInfo";
import { getCountryName } from "./utils/currencyData";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("usd");
  const [toCurrency, setToCurrency] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [hasConverted, setHasConverted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // "" means latest
  const [showChart, setShowChart] = useState(false);

  const currencyInfo = useCurrencyInfo(
    fromCurrency,
    selectedDate || "latest"
  );
  const options = Object.keys(currencyInfo);

  const swap = () => {
    const tempFrom = fromCurrency;
    const tempTo = toCurrency;
    const tempAmount = amount;
    const tempConverted = convertedAmount;

    setFromCurrency(tempTo);
    setToCurrency(tempFrom);
    setAmount(tempConverted);
    setConvertedAmount(tempAmount);
  };

  const convert = () => {
    if (currencyInfo[toCurrency]) {
      setConvertedAmount(
        parseFloat((amount * currencyInfo[toCurrency]).toFixed(4))
      );
      setHasConverted(true);
    }
  };

  // Today's date for the max attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(0,210,160,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(255,107,107,0.05) 0%, transparent 50%),
          #0f0f1a`,
      }}
    >
      {/* Floating orbs */}
      <div className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none bg-purple-500/10 top-[10%] left-[15%] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute w-60 h-60 rounded-full blur-3xl pointer-events-none bg-emerald-500/10 bottom-[15%] right-[10%] animate-[float_8s_ease-in-out_infinite_-3s]" />
      <div className="absolute w-48 h-48 rounded-full blur-3xl pointer-events-none bg-red-400/8 top-[60%] left-[60%] animate-[float_8s_ease-in-out_infinite_-5s]" />

      <div
        className="w-full max-w-lg bg-white/[0.05] backdrop-blur-2xl border border-white/10
                    rounded-3xl p-5 sm:p-7 relative z-10
                    shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.05)]
                    animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl">💱</span> Currency Converter
          </h1>
          <p className="text-[0.75rem] text-white/40 mt-1 tracking-wide">
            Real-time exchange rates • 150+ currencies
          </p>
        </div>

        {/* Date Picker */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <label className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/40 shrink-0">
            Rate Date
          </label>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setHasConverted(false);
              }}
              max={today}
              min="2020-01-01"
              className="flex-1 sm:flex-none bg-white/5 border border-white/10 rounded-lg px-3 py-1.5
                         text-[0.8rem] text-white outline-none cursor-pointer
                         transition-all
                         hover:border-white/25
                         focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(108,92,231,0.3)]
                         [color-scheme:dark]"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDate("");
                  setHasConverted(false);
                }}
                className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-[0.75rem]
                           text-white/60 cursor-pointer transition-all
                           hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
              >
                Reset to Today
              </button>
            )}
          </div>
          {selectedDate && (
            <span className="text-[0.7rem] text-amber-400/70">
              Showing rates for {selectedDate}
            </span>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            convert();
          }}
        >
          {/* From */}
          <InputBox
            label="From"
            amount={amount}
            currencyType={options}
            onAmountChange={setAmount}
            onCurrencyTypeChange={(currency) => {
              setFromCurrency(currency);
              setHasConverted(false);
            }}
            selectCurrency={fromCurrency}
          />

          {/* Swap */}
          <div className="flex justify-center my-3 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <button
              type="button"
              onClick={swap}
              className="relative z-10 w-11 h-11 rounded-full bg-purple-600 border-[3px] border-[#0f0f1a]
                         text-white text-lg cursor-pointer flex items-center justify-center
                         transition-all duration-300
                         shadow-[0_4px_16px_rgba(108,92,231,0.4)]
                         hover:rotate-180 hover:scale-110 hover:shadow-[0_6px_24px_rgba(108,92,231,0.5)]
                         active:scale-95"
            >
              <span className="font-bold">⇅</span>
            </button>
          </div>

          {/* To */}
          <InputBox
            label="To"
            amount={hasConverted ? convertedAmount : ""}
            currencyType={options}
            onCurrencyTypeChange={(currency) => {
              setToCurrency(currency);
              setHasConverted(false);
            }}
            selectCurrency={toCurrency}
            amountdisable
          />

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl border-none
                         bg-gradient-to-br from-emerald-400 to-emerald-600
                         text-white font-bold text-[0.9rem] cursor-pointer
                         transition-all duration-200
                         shadow-[0_4px_16px_rgba(0,210,160,0.3)]
                         hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,210,160,0.4)] hover:brightness-110
                         active:translate-y-0"
            >
              Convert {fromCurrency.toUpperCase()} → {toCurrency.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => setShowChart(!showChart)}
              className={`px-4 py-3 rounded-xl border text-[0.8rem] font-semibold cursor-pointer
                          transition-all duration-200
                          ${showChart
                  ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300"
                }`}
            >
              📊
            </button>
          </div>
        </form>

        {/* Rate badge */}
        {hasConverted && currencyInfo[toCurrency] && (
          <div className="text-center mt-4 animate-[fadeSlideUp_0.4s_ease]">
            <span
              className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20
                          rounded-full text-[0.75rem] font-medium text-emerald-400 tracking-wide"
            >
              1 {fromCurrency.toUpperCase()} ({getCountryName(fromCurrency)}) ={" "}
              {currencyInfo[toCurrency].toFixed(4)} {toCurrency.toUpperCase()} (
              {getCountryName(toCurrency)})
            </span>
          </div>
        )}

        {/* Year Chart */}
        {showChart && (
          <RateChart
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            onClose={() => setShowChart(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
