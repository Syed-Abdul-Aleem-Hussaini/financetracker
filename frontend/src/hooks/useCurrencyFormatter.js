import { useEffect, useState } from "react";

export default function useCurrencyFormatter() {
  const [rate, setRate] = useState(null); // null means not ready
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const to = user.currency || "INR";
    const from = "USD";

    setCurrency(to);

    if (to === from) {
      setRate(1);
      return;
    }

 fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${to}`)
  .then(res => res.json())
  .then(data => {
    if (data.rates && data.rates[to]) {
      setRate(data.rates[to]);
    } else {
      setRate(1);
    }
  })
      .catch((err) => {
        console.error("Failed to fetch exchange rate:", err);
        setError(err);
        setRate(1);
      });
  }, []);

  const formatCurrency = (value) => {
    if (isNaN(value)) return "Invalid amount";
    if (rate === null) return "Loading...";
    
    const converted = value * rate;
    console.log(`Converting: ${value} USD to ${currency} at rate ${rate} = ${converted}`); // Debug log

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted);
    } catch (err) {
      console.error("Formatting error:", err);
      return converted.toFixed(2) + " " + currency;
    }
  };

  return [formatCurrency, rate !== null, error];
}