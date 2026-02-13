import { useEffect, useState } from "react";

function useCurrencyInfo(currency, date = "latest") {
    const [data, setData] = useState({});

    useEffect(() => {
        const apiDate = date || "latest";
        fetch(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${apiDate}/v1/currencies/${currency}.json`
        )
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((res) => setData(res[currency]))
            .catch((err) => {
                console.error("Currency fetch failed:", err);
                setData({});
            });
    }, [currency, date]);

    return data;
}

export default useCurrencyInfo;