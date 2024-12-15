import { useState, useEffect, useCallback } from "react";

const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.REACT_APP_API_KEY}`;
const TARGET_CURRENCIES = ["CAD", "EUR", "IDR", "JPY", "CHF", "GBP"];

export default function Assignment5() {
  const [currencies, setCurrencies] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const getPercentageValue = (numStr, percentage) => {
    const num = parseFloat(numStr);
    return (num * percentage) / 100;
  };

  const getPurchaseRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) + percentage;
  };

  const getSellRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) - percentage;
  };

  const fetchCurrencyData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        const respJson = await res.json();
        throw respJson;
      }

      const result = await res.json();
      const rates = result.rates;
      const percentage = 5;

      const formattedCurrencies = TARGET_CURRENCIES.map((code) => ({
        code,
        weBuy: getPurchaseRate(
          rates[code],
          getPercentageValue(rates[code], percentage)
        ),
        exchangeRate: parseFloat(rates[code]),
        weSell: getSellRate(
          rates[code],
          getPercentageValue(rates[code], percentage)
        ),
      }));

      setCurrencies(formattedCurrencies);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("[fetchCurrencyData]:", error);
    }
  }, []);

  useEffect(() => {
    fetchCurrencyData();
  }, [fetchCurrencyData]);

  return (
    <div className="min-h-screen bg-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Header */}
        <div className="p-6 bg-orange-500 text-white">
          <h1 className="text-3xl font-bold text-center">
            Currency Exchange Rates
          </h1>
        </div>

        {/* Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-3 text-left text-orange-800 font-semibold">
                  Currency
                </th>
                <th className="p-3 text-right text-orange-800 font-semibold">
                  We Buy
                </th>
                <th className="p-3 text-right text-orange-800 font-semibold">
                  Exchange Rate
                </th>
                <th className="p-3 text-right text-orange-800 font-semibold">
                  We Sell
                </th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((currency) => (
                <tr
                  key={currency.code}
                  className="border-b border-orange-200 hover:bg-orange-50 transition-colors"
                >
                  <td className="p-3 text-left font-medium">{currency.code}</td>
                  <td className="p-3 text-right">
                    {currency.weBuy.toFixed(6)}
                  </td>
                  <td className="p-3 text-right">
                    {currency.exchangeRate.toFixed(6)}
                  </td>
                  <td className="p-3 text-right">
                    {currency.weSell.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-orange-100 text-center text-sm text-orange-800">
          Rates updated: {lastUpdated}
        </div>
      </div>
    </div>
  );
}
