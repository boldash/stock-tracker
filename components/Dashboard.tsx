'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Holding {
  id: string;
  stock_name: string;
  ticker: string;
  shares: number;
  avg_price: number;
  currency: string;
}

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      const { data: holdingsData, error } = await supabase.from('holdings').select('*');
      if (error) {
        console.error('Error fetching holdings:', error);
        return;
      }
      setHoldings(holdingsData || []);
    };

    fetchHoldings();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const enriched = await Promise.all(
        holdings.map(async (h) => {
          const quoteRes = await fetch(`/api/quote?ticker=${h.ticker}`);
          const quote = await quoteRes.json();

          const ratingRes = await fetch(`/api/rating?ticker=${h.ticker}`);
          const rating = await ratingRes.json();

          const targetRes = await fetch(`/api/target?ticker=${h.ticker}`);
          const target = await targetRes.json();

          return {
            ...h,
            currentPrice: quote?.c ?? 0,
            change: ((quote?.c - h.avg_price) / h.avg_price) * 100,
            ratingSummary: rating?.buy > rating?.sell ? 'Buy' : 'Hold/Sell',
            priceTarget: target?.targetMean ?? null,
          };
        })
      );

      setData(enriched);
    };

    if (holdings.length > 0) {
      fetchData();
    }
  }, [holdings]);

  if (!data.length) return null;

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">📊 Portfolio Dashboard</h2>
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Shares</th>
            <th className="p-2 border">Avg Buy</th>
            <th className="p-2 border">Current</th>
            <th className="p-2 border">Return</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Target</th>
          </tr>
        </thead>
        <tbody>
          {data.map((h) => (
            <tr key={h.id}>
              <td className="p-2 border">{h.stock_name} ({h.ticker})</td>
              <td className="p-2 border">{h.shares}</td>
              <td className="p-2 border">€{h.avg_price.toFixed(2)}</td>
              <td className="p-2 border">€{h.currentPrice.toFixed(2)}</td>
              <td className={`p-2 border font-semibold ${h.change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {h.change.toFixed(2)}%
              </td>
              <td className="p-2 border">{h.ratingSummary}</td>
              <td className="p-2 border">
                {h.priceTarget ? `€${h.priceTarget.toFixed(2)}` : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
