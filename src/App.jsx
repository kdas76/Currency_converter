import { useState } from "react";
import InputBox from "./components/InputBox";
import RateChart from "./components/RateChart";
import LoginModal from "./components/LoginModal";
import SubscribeModal from "./components/SubscribeModal";
import useCurrencyInfo from "./hooks/useCurrencyInfo";
import { getCountryName } from "./utils/currencyData";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("usd");
  const [toCurrency, setToCurrency] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [hasConverted, setHasConverted] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // 🔐 Auth + Usage State
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [hasSubscription, setHasSubscription] = useState(
    localStorage.getItem("hasSubscription") === "true"
  );

  const [usageCount, setUsageCount] = useState(() => {
    const saved = localStorage.getItem("usageCount");
    return saved ? Number(saved) : 0;
  });

  const [chartUsageCount, setChartUsageCount] = useState(() => {
    const saved = localStorage.getItem("chartUsageCount");
    return saved ? Number(saved) : 0;
  });

  const currencyInfo = useCurrencyInfo(
    fromCurrency,
    selectedDate || "latest"
  );

  const options = Object.keys(currencyInfo);

  // 🔢 Get Usage Limit
  const getLimit = () => {
    if (!isLoggedIn) return 1;
    if (hasSubscription) return Infinity;
    return 3;
  };

  // 🔁 Swap currencies
  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount || amount);
    setConvertedAmount(amount);
    setHasConverted(false);
  };

  // 💱 Convert Function
  const convert = () => {
    const limit = getLimit();

    if (usageCount >= limit) {
      alert(
        !isLoggedIn
          ? "Please login to continue converting currencies."
          : "Free limit reached. Please subscribe to continue."
      );
      return;
    }

    if (currencyInfo[toCurrency] !== undefined) {
      const result = parseFloat(
        (amount * currencyInfo[toCurrency]).toFixed(4)
      );

      setConvertedAmount(result);
      setHasConverted(true);

      if (limit !== Infinity) {
        const newUsage = usageCount + 1;
        setUsageCount(newUsage);
        localStorage.setItem("usageCount", newUsage);
      }
    }
  };

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
      <div className="w-full max-w-lg bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 relative z-10 shadow-xl">

        {/* 🔐 Auth Buttons */}
        <div className="flex justify-end gap-3 mb-3 text-xs">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400
                         cursor-pointer transition-all hover:bg-emerald-500/25 hover:text-emerald-300"
            >
              🔐 Login
            </button>
          ) : (
            <>
              {!hasSubscription && (
                <button
                  onClick={() => setShowSubscribeModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-400
                             cursor-pointer transition-all hover:bg-purple-500/25 hover:text-purple-300"
                >
                  Subscription
                </button>
              )}

              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setHasSubscription(false);
                  setUsageCount(0);
                  setChartUsageCount(0);
                  localStorage.setItem("isLoggedIn", "false");
                  localStorage.setItem("hasSubscription", "false");
                  localStorage.setItem("usageCount", 0);
                  localStorage.setItem("chartUsageCount", 0);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-red-400
                           cursor-pointer transition-all hover:bg-red-500/15 hover:text-red-300"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold text-white">
            💱 Currency Converter
          </h1>

          <p className="text-[0.7rem] text-white/40 mt-2">
            {(() => {
              const limit = getLimit();
              if (limit === Infinity) return "Unlimited conversions & charts";
              const remainConvert = Math.max(limit - usageCount, 0);
              const remainChart = Math.max(limit - chartUsageCount, 0);
              return `Converts: ${remainConvert}  •  Charts: ${remainChart}`;
            })()}
          </p>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setHasConverted(false);
            }}
            max={today}
            min={"2024-03-04"}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            convert();
          }}
        >
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

          <div className="flex justify-center my-3">
            <button
              type="button"
              onClick={swap}
              className="w-10 h-10 rounded-full bg-purple-600 text-white"
            >
              ⇅
            </button>
          </div>

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

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold"
            >
              Convert
            </button>

            <button
              type="button"
              onClick={() => {
                // Closing is always free
                if (showChart) {
                  setShowChart(false);
                  return;
                }

                // Opening costs 1 chart usage
                const limit = getLimit();
                if (chartUsageCount >= limit) {
                  alert(
                    !isLoggedIn
                      ? "Please login to view more charts."
                      : "Chart limit reached. Please subscribe for unlimited."
                  );
                  return;
                }

                setShowChart(true);

                if (limit !== Infinity) {
                  const newUsage = chartUsageCount + 1;
                  setChartUsageCount(newUsage);
                  localStorage.setItem("chartUsageCount", newUsage);
                }
              }}
              className="px-4 py-3 rounded-xl bg-purple-500 text-white cursor-pointer transition-all
                         hover:brightness-110 active:scale-95"
            >
              📊
            </button>
          </div>
        </form>

        {/* Rate Badge */}
        {hasConverted && currencyInfo[toCurrency] && (
          <div className="text-center mt-4">
            <span className="text-emerald-400 text-sm">
              1 {fromCurrency.toUpperCase()} ({getCountryName(fromCurrency)}) =
              {" "}
              {currencyInfo[toCurrency].toFixed(4)}{" "}
              {toCurrency.toUpperCase()} ({getCountryName(toCurrency)})
            </span>
          </div>
        )}

        {showChart && (
          <RateChart
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            onClose={() => setShowChart(false)}
          />
        )}
      </div>

      {/* 🔐 Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(email) => {
            setIsLoggedIn(true);
            setUsageCount(0);
            setChartUsageCount(0);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("usageCount", 0);
            localStorage.setItem("chartUsageCount", 0);
            setShowLoginModal(false);
          }}
        />
      )}

      {/* ⭐ Subscribe Modal */}
      {showSubscribeModal && (
        <SubscribeModal
          onClose={() => setShowSubscribeModal(false)}
          onSubscribe={(plan) => {
            setHasSubscription(true);
            localStorage.setItem("hasSubscription", "true");
            localStorage.setItem("plan", plan);
            setShowSubscribeModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
