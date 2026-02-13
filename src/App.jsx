import { useState } from "react";
import InputBox from "./components/InputBox";
import useCurrencyInfo from "./hooks/useCurrencyInfo";
import { getCountryName } from "./utils/currencyData";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("usd");
  const [toCurrency, setToCurrency] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [hasConverted, setHasConverted] = useState(false);

  const currencyInfo = useCurrencyInfo(fromCurrency);
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

  return (
    <div className="app-wrapper">
      {/* Floating orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="converter-container">
        {/* Header */}
        <div className="converter-header">
          <h1 className="converter-title">
            <span className="title-icon">💱</span> Currency Converter
          </h1>
          <p className="converter-subtitle">
            Real-time exchange rates • 150+ currencies
          </p>
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
          <div className="swap-row">
            <button type="button" onClick={swap} className="swap-btn">
              <span className="swap-icon">⇅</span>
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

          {/* Convert Button */}
          <button type="submit" className="convert-btn">
            Convert {fromCurrency.toUpperCase()} → {toCurrency.toUpperCase()}
          </button>
        </form>

        {/* Rate badge */}
        {hasConverted && currencyInfo[toCurrency] && (
          <div className="rate-info">
            <span className="rate-badge">
              1 {fromCurrency.toUpperCase()} ({getCountryName(fromCurrency)}) ={" "}
              {currencyInfo[toCurrency].toFixed(4)} {toCurrency.toUpperCase()} (
              {getCountryName(toCurrency)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
