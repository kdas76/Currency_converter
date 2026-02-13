import React, { useId, useState, useRef, useEffect } from "react";
import { getCountryName, searchByCountry } from "../utils/currencyData";

function InputBox({
    label,
    amount,
    onAmountChange,
    currencyType = [],
    onCurrencyTypeChange,
    selectCurrency = "usd",
    amountdisable = false,
    currencydisable = false,
    className = "",
}) {
    const amountInputId = useId();
    const currencySelectId = useId();
    const countryInputId = useId();

    const [countrySearch, setCountrySearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const selectedCountry = getCountryName(selectCurrency);

    const handleCountrySearch = (value) => {
        setCountrySearch(value);
        if (value.trim().length > 0) {
            const results = searchByCountry(value, currencyType);
            setSearchResults(results.slice(0, 8));
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const handleSelectFromSearch = (code) => {
        onCurrencyTypeChange && onCurrencyTypeChange(code);
        setCountrySearch("");
        setSearchResults([]);
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className={`rounded-2xl border border-white/10 bg-white/[0.06] p-4 flex flex-col sm:flex-row gap-3
                   transition-all duration-300 hover:border-white/20 hover:shadow-lg
                   focus-within:border-purple-500 focus-within:shadow-[0_0_0_3px_rgba(108,92,231,0.3)] ${className}`}
        >
            {/* Left: Amount */}
            <div className="flex-1 min-w-0">
                <label
                    htmlFor={amountInputId}
                    className="block text-[0.65rem] font-semibold uppercase tracking-wider text-white/40 mb-1.5"
                >
                    {label}
                </label>
                <input
                    id={amountInputId}
                    className="w-full bg-transparent border-none outline-none text-2xl font-semibold text-white
                     placeholder:text-white/20 placeholder:text-base placeholder:font-normal
                     disabled:opacity-50 disabled:cursor-not-allowed
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    placeholder="Enter amount"
                    disabled={amountdisable}
                    value={amount}
                    onChange={(e) => {
                        onAmountChange && onAmountChange(Number(e.target.value));
                    }}
                />
            </div>

            {/* Right: Currency + Country */}
            <div className="flex flex-col items-start sm:items-end sm:min-w-[160px]">
                <label
                    htmlFor={currencySelectId}
                    className="block text-[0.65rem] font-semibold uppercase tracking-wider text-white/40 mb-1.5"
                >
                    Currency
                </label>

                {/* Select + search row */}
                <div className="flex gap-1.5 w-full sm:w-auto">
                    <select
                        id={currencySelectId}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[0.8rem] font-semibold text-white
                       cursor-pointer outline-none transition-all w-20 shrink-0
                       hover:border-white/25 hover:bg-white/10
                       focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(108,92,231,0.3)]
                       [&>option]:bg-[#1a1a2e] [&>option]:text-white"
                        value={selectCurrency}
                        onChange={(e) =>
                            onCurrencyTypeChange && onCurrencyTypeChange(e.target.value)
                        }
                        disabled={currencydisable}
                    >
                        {currencyType.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    {/* Country search */}
                    <div className="relative flex-1 min-w-0" ref={dropdownRef}>
                        <input
                            id={countryInputId}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[0.75rem] text-white
                         outline-none transition-all
                         placeholder:text-white/25 placeholder:text-[0.7rem]
                         focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(108,92,231,0.3)] focus:bg-white/10
                         disabled:opacity-50 disabled:cursor-not-allowed"
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => handleCountrySearch(e.target.value)}
                            onFocus={() => {
                                if (countrySearch.trim().length > 0) setShowDropdown(true);
                            }}
                            disabled={currencydisable}
                        />

                        {showDropdown && searchResults.length > 0 && (
                            <div
                                className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-white/15
                            rounded-xl overflow-hidden z-50 shadow-[0_12px_32px_rgba(0,0,0,0.5)]
                            max-h-60 overflow-y-auto animate-[fadeSlideUp_0.2s_ease]"
                            >
                                {searchResults.map((code) => (
                                    <button
                                        key={code}
                                        type="button"
                                        className="flex items-center gap-2.5 w-full px-3 py-2 border-none bg-transparent
                               text-white text-[0.78rem] cursor-pointer text-left
                               transition-colors hover:bg-purple-500/20"
                                        onClick={() => handleSelectFromSearch(code)}
                                    >
                                        <span className="font-bold text-[0.75rem] text-purple-300 min-w-[36px]">
                                            {code.toUpperCase()}
                                        </span>
                                        <span className="text-white/50 truncate">
                                            {getCountryName(code)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Country badge */}
                <div
                    className="mt-2 px-2.5 py-0.5 bg-purple-500/12 border border-purple-500/20
                      rounded-full text-[0.65rem] font-medium text-purple-300
                      truncate max-w-full"
                >
                    {selectedCountry}
                </div>
            </div>
        </div>
    );
}

export default InputBox;