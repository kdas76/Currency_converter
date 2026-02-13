# 💱 Currency Converter

A premium, real-time currency converter built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Chart.js**. Features live & historical exchange rates, country-based search, and a 12-month trend chart — all wrapped in a dark glassmorphism UI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **150+ Currencies** | All major world currencies + crypto (BTC, ETH, DOGE, etc.) |
| **Live Rates** | Fetches real-time exchange rates from the fawazahmed0 API |
| **Historical Rates** | Pick any date (back to 2020) to see that day's exchange rate |
| **12-Month Chart** | Interactive line graph showing the past year's trend |
| **Country Search** | Type a country name (e.g. "India") to find its currency |
| **Country Name Display** | Each selected currency shows its country in a badge |
| **Instant Swap** | One-click swap between From ↔ To currencies and amounts |
| **Responsive** | Fully responsive — works on mobile, tablet, and desktop |
| **Dark Glassmorphism** | Premium UI with floating orbs, glass cards, and animations |

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI framework |
| Vite | 7 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Chart.js | 4+ | Line chart rendering |
| react-chartjs-2 | 5+ | React wrapper for Chart.js |
| Inter Font | — | Google Fonts typography |

---

## 📁 Project Structure

```
project_5/
├── index.html                        # Entry HTML with meta tags
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Vite configuration
└── src/
    ├── main.jsx                      # React entry point
    ├── App.jsx                       # Main app — form, date picker, chart toggle
    ├── index.css                     # Minimal CSS (font, keyframes, scrollbar)
    │
    ├── components/
    │   ├── InputBox.jsx              # Amount input + currency select + country search
    │   └── RateChart.jsx             # 12-month line chart (Chart.js)
    │
    ├── hooks/
    │   ├── useCurrencyInfo.js        # Fetches rates for a base currency + date
    │   └── useHistoricalRates.js     # Fetches 12 monthly data points for chart
    │
    └── utils/
        └── currencyData.js           # Currency → country name map + search helper
```

---

## 🚀 Setup & Run

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Quick Start

```bash
# 1. Navigate to the project
cd project_5

# 2. Install all dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build      # Build for production
npm run preview    # Preview the build locally
```

---

## 📖 How to Use

### Basic Conversion
1. Enter an **amount** in the "From" field (defaults to 1)
2. Select the **source currency** from the dropdown (e.g. USD)
3. Select the **target currency** in the "To" section (e.g. INR)
4. Click **Convert** — the converted amount appears in the "To" field

### Search by Country Name
1. In the **"Search country..."** input next to the currency dropdown, type a country name (e.g. "Japan", "India", "Brazil")
2. A dropdown shows matching results with currency codes
3. Click a result — the currency auto-selects (e.g. typing "Japan" selects JPY)

### Swap Currencies
- Click the **⇅ Swap** button between the two inputs
- Both currencies AND their amounts swap instantly

### Historical Rates (Date Picker)
1. Use the **Rate Date** picker at the top
2. Select any date from **2020-01-01** to **today**
3. The rates update to reflect that specific day's exchange rate
4. Click **"Reset to Today"** to go back to live rates

### Year-wise Chart
1. Click the **📊** button next to the Convert button
2. A 12-month line chart appears showing the exchange rate trend
3. Hover over data points to see exact rates
4. Click **✕** to close the chart

---

## 🔧 How Everything Works — Deep Dive

### Data Flow

```
User selects currency + date
        ↓
  useCurrencyInfo(currency, date)
        ↓
  Fetches from fawazahmed0 API
        ↓
  Returns { currencyCode: rate } object
        ↓
  App.jsx uses rate to calculate conversion
        ↓
  Result shown in "To" InputBox
```

### `useCurrencyInfo(currency, date)` — Core Hook

This hook fetches exchange rates. It accepts two params:

- `currency` — base currency code (e.g. `"usd"`)
- `date` — `"latest"` for today's rate, or `"2025-01-15"` for historical

**API URL pattern:**
```
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/currencies/{code}.json
```

**How it works:**
1. `useEffect` triggers whenever `currency` or `date` changes
2. Fetches the API, checks HTTP status
3. Parses JSON and extracts `res[currency]` (the rates object)
4. On error → logs to console and returns empty `{}`

---

### `useHistoricalRates(from, to)` — Chart Data Hook

Fetches 12 monthly data points for the chart.

**How it works:**
1. Generates 12 dates — the 1st of each month for the past year
2. Fires **12 parallel fetch requests** (`Promise.all`) for speed
3. Extracts the specific `from → to` rate from each response
4. Returns `{ data: [{date, rate}...], loading, error }`

Example: For USD → INR, it fetches:
```
@2025-03-01, @2025-04-01, ... @2026-02-01
```
And extracts the `inr` value from each response.

---

### `InputBox` — Reusable Input Component

Each InputBox renders three things:
1. **Amount input** — number field on the left
2. **Currency dropdown** — `<select>` with all available currency codes
3. **Country search** — text input that filters currencies by country name

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | "From" or "To" |
| `amount` | number | Current value |
| `onAmountChange` | function | Called when user types |
| `currencyType` | string[] | Available currency codes |
| `onCurrencyTypeChange` | function | Called when currency changes |
| `selectCurrency` | string | Currently selected code |
| `amountdisable` | boolean | Lock the amount input |
| `currencydisable` | boolean | Lock the currency selector |

**Country search flow:**
```
User types "Ind" → searchByCountry("Ind", options)
  → Filters: ["inr" (India), "idr" (Indonesia)]
  → Shows dropdown with results
  → User clicks "INR" → currency auto-selects
  → Country badge shows "India"
```

---

### `RateChart` — Line Chart Component

Uses **Chart.js** with `react-chartjs-2` to render a 12-month line chart.

**Configuration:**
- Purple gradient fill under the line
- Dark-themed axes, tooltips, and grid
- Responsive — auto-resizes with container
- Shows loading spinner while data fetches
- Gracefully handles errors and empty data

---

### `currencyData.js` — Currency Mapping

A static map of **150+ currency codes** to country names:

```js
{
  usd: "United States",
  inr: "India",
  jpy: "Japan",
  btc: "Bitcoin",
  // ... 150+ entries
}
```

**Exported functions:**
- `getCountryName(code)` — Returns country name, or uppercase code as fallback
- `searchByCountry(query, currencies)` — Filters currencies by matching country name or code

---

## 🐛 Bugs Fixed (from original code)

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | Swap gave wrong values | React setState is async — reading state right after setting it returns old values | Used temp variables to capture values before swapping |
| 2 | App broke on network errors | `fetch()` had no `.catch()` block | Added error handling with graceful fallback to `{}` |
| 3 | Input showed "0" on load | `useState(0)` renders the number 0 | Changed default to `useState(1)` |
| 4 | Labels not accessible | `<label>` not connected to `<input>` via htmlFor/id | Used React `useId()` for proper label-input binding |

---

## 🌐 API Reference

**Provider:** [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) (free, no API key needed)

| Endpoint | URL |
|----------|-----|
| Latest rates | `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{code}.json` |
| Historical | `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{YYYY-MM-DD}/v1/currencies/{code}.json` |
| All currencies | `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json` |

**Response format:**
```json
{
  "date": "2026-02-13",
  "usd": {
    "inr": 90.68,
    "eur": 0.84,
    "gbp": 0.73,
    "jpy": 152.61,
    "btc": 0.0000147
  }
}
```

---

## 📜 License

Educational project. Currency data by [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) (MIT License).
