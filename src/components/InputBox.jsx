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

    // Handle country search input
    const handleCountrySearch = (value) => {
        setCountrySearch(value);
        if (value.trim().length > 0) {
            const results = searchByCountry(value, currencyType);
            setSearchResults(results.slice(0, 8)); // limit to 8 results
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    // Select currency from country search results
    const handleSelectFromSearch = (code) => {
        onCurrencyTypeChange && onCurrencyTypeChange(code);
        setCountrySearch("");
        setSearchResults([]);
        setShowDropdown(false);
    };

    // Close dropdown on outside click
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
        <div className={`input-box-card ${className}`}>
            {/* Left: Amount */}
            <div className="input-box-left">
                <label htmlFor={amountInputId} className="input-label">
                    {label}
                </label>
                <input
                    id={amountInputId}
                    className="amount-input"
                    type="number"
                    placeholder="Enter amount"
                    disabled={amountdisable}
                    value={amount}
                    onChange={(e) => {
                        onAmountChange && onAmountChange(Number(e.target.value));
                    }}
                />
            </div>

            {/* Right: Currency dropdown + Country search */}
            <div className="input-box-right">
                <label htmlFor={currencySelectId} className="input-label">
                    Currency
                </label>

                <div className="currency-row">
                    {/* Currency dropdown */}
                    <select
                        id={currencySelectId}
                        className="currency-select"
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

                    {/* Country search input */}
                    <div className="country-search-wrapper" ref={dropdownRef}>
                        <input
                            id={countryInputId}
                            className="country-search-input"
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => handleCountrySearch(e.target.value)}
                            onFocus={() => {
                                if (countrySearch.trim().length > 0) setShowDropdown(true);
                            }}
                            disabled={currencydisable}
                        />

                        {/* Search results dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div className="country-dropdown">
                                {searchResults.map((code) => (
                                    <button
                                        key={code}
                                        type="button"
                                        className="country-dropdown-item"
                                        onClick={() => handleSelectFromSearch(code)}
                                    >
                                        <span className="dropdown-code">
                                            {code.toUpperCase()}
                                        </span>
                                        <span className="dropdown-country">
                                            {getCountryName(code)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected country name */}
                <div className="country-badge">
                    {selectedCountry}
                </div>
            </div>
        </div>
    );
}

export default InputBox;