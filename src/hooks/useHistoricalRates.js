import { useEffect, useState } from "react";

/**
 * Fetches monthly exchange rates for the past 12 months.
 * Returns { data: [{date, rate}], loading, error }
 */
function useHistoricalRates(fromCurrency, toCurrency) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!fromCurrency || !toCurrency) return;

        setLoading(true);
        setError(null);

        // Build 12 monthly date strings (1st of each month going back)
        const dates = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = "01";
            dates.push(`${yyyy}-${mm}-${dd}`);
        }

        // Fetch all 12 dates in parallel
        Promise.all(
            dates.map((date) =>
                fetch(
                    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${fromCurrency}.json`
                )
                    .then((res) => {
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return res.json();
                    })
                    .then((res) => ({
                        date,
                        rate: res[fromCurrency]?.[toCurrency] ?? null,
                    }))
                    .catch(() => ({ date, rate: null }))
            )
        )
            .then((results) => {
                // Filter out any failed fetches
                setData(results.filter((r) => r.rate !== null));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Historical rates fetch failed:", err);
                setError("Failed to load historical data");
                setLoading(false);
            });
    }, [fromCurrency, toCurrency]);

    return { data, loading, error };
}

export default useHistoricalRates;
