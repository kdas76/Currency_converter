# 💱 Currency Converter

A sleek, real-time currency converter built with **React 19** + **Vite** + **Tailwind CSS v4**. Supports **150+ currencies** with country name search, live exchange rates, and a premium dark glassmorphism UI.

---

## ✨ Features

- **Real-time rates** — Fetches live exchange rates from the [fawazahmed0 Currency API](https://github.com/fawazahmed0/exchange-api)
- **150+ currencies** — All major world currencies + popular cryptocurrencies (BTC, ETH, DOGE, etc.)
- **Country search** — Type a country name (e.g. "India", "Japan") to quickly find its currency
- **Country name display** — Each selected currency shows its country name in a badge
- **Instant swap** — One-click swap between "From" and "To" currencies
- **Conversion rate badge** — Shows the per-unit exchange rate after conversion
- **Responsive design** — Works beautifully on desktop and mobile
- **Dark glassmorphism UI** — Premium look with floating orbs, glass cards, and smooth animations

---

## 🛠️ Tech Stack

| Tool         | Version | Purpose              |
| ------------ | ------- | -------------------- |
| React        | 19      | UI framework         |
| Vite         | 7       | Build tool & dev server |
| Tailwind CSS | 4       | Utility-first CSS    |
| Inter Font   | —       | Google Fonts typography |

---

## 📁 Project Structure

```
project_5/
├── index.html                    # Entry HTML with meta tags
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Main app — form, swap, convert logic
    ├── index.css                 # Global styles (dark theme, glassmorphism)
    ├── components/
    │   └── InputBox.jsx          # Reusable input — amount, currency select, country search
    ├── hooks/
    │   └── useCurrencyInfo.js    # Custom hook — fetches live exchange rates
    └── utils/
        └── currencyData.js       # Currency → Country name mapping + search helper
```

---

## 🚀 Setup & Run

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone or navigate to the project
cd project_5

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at **http://localhost:5173** (Vite default port).

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 📖 How to Use

1. **Enter an amount** in the "From" input field (defaults to 1)
2. **Select a currency** from the dropdown (e.g. USD, INR, EUR)
   - **Or search by country** — type a country name like "Japan" in the search box and click the result to auto-select JPY
3. **Select the target currency** in the "To" section (same method)
4. Click the **Convert** button to see the converted amount
5. Use the **⇅ Swap** button to instantly swap the two currencies and their amounts
6. After conversion, a **rate badge** appears showing the per-unit exchange rate with country names

---

## 🔧 Key Components Explained

### `useCurrencyInfo(currency)` — Custom Hook
Fetches live exchange rates for the given base currency from the API. Returns an object where keys are currency codes and values are exchange rates. Includes error handling with graceful fallback.

### `InputBox` — Reusable Component
Renders an amount input, a currency dropdown, and a country search input side by side. Props:

| Prop                  | Type       | Description                           |
| --------------------- | ---------- | ------------------------------------- |
| `label`               | string     | Label text ("From" / "To")            |
| `amount`              | number     | Current amount value                  |
| `onAmountChange`      | function   | Callback when amount changes          |
| `currencyType`        | string[]   | List of available currency codes      |
| `onCurrencyTypeChange`| function   | Callback when currency is selected    |
| `selectCurrency`      | string     | Currently selected currency code      |
| `amountdisable`       | boolean    | Disable the amount input              |
| `currencydisable`     | boolean    | Disable the currency dropdown         |

### `currencyData.js` — Currency Mapping
Maps 150+ currency codes to their country names. Exports:
- `getCountryName(code)` — Returns the country name for a currency code
- `searchByCountry(query, availableCurrencies)` — Filters currencies by country name match

---

## 🐛 Bugs Fixed (from original code)

| Bug | Issue | Fix |
|-----|-------|-----|
| Stale swap state | `swap()` read state values after async `setState` calls | Used temp variables to capture values before swapping |
| No error handling | API fetch had no `.catch()`, app broke silently on network errors | Added `.catch()` with `console.error` and graceful fallback |
| Default amount `0` | Input showed "0" on page load | Changed default to `1` |
| Unlabeled inputs | `<label>` not connected to `<input>` via `htmlFor`/`id` | Used React `useId()` for accessible label-input binding |

---

## 🌐 API Reference

**Base URL:**
```
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{code}.json
```

**Example** — Get all rates for USD:
```
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
```

Returns:
```json
{
  "date": "2026-02-13",
  "usd": {
    "inr": 90.68,
    "eur": 0.84,
    "gbp": 0.73,
    ...
  }
}
```

---

## 📜 License

This project is for **educational purposes**. Currency data provided by [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) (MIT License).
