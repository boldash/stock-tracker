'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Transaction {
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  ticker: string;
  date: string;
}

export default function Ledger() {
  const [totals, setTotals] = useState({ invested: 0, out: 0, value: 0, net: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('transactions').select('*');
      if (error || !data) return;

      let invested = 0;
      let out = 0;
      const tickers = [...new Set(data.map((t) => t.ticker))];
      const prices: { [ticker: string]: number } = {};

      for (const ticker of tickers) {
        const quote = await fetch(`/api/quote?ticker=${ticker}`).then((r) => r.json());
        prices[ticker] = quote?.c ?? 0;
      }

      const holdings: { [ticker: string]: number } = {};
      data.forEach((t) => {
        if (!holdings[t.ticker]) holdings[t.ticker] = 0;
        if (t.type === 'buy') {
          holdings[t.ticker] += t.amount;
          invested += t.amount * t.price;
        } else {
          holdings[t.ticker] -= t.amount;
          out += t.amount * t.price;
        }
      });

      let value = 0;
      for (const ticker in holdings) {
        value += holdings[ticker] * (prices[ticker] || 0);
      }

      setTotals({ invested, out, value, net: value + out - invested });
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto mt-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">📒 Ledger Summary</h2>
      <ul className="space-y-2">
        <li>Total Invested: <strong>€{totals.invested.toFixed(2)}</strong></li>
        <li>Withdrawn: <strong>€{totals.out.toFixed(2)}</strong></li>
        <li>Current Value: <strong>€{totals.value.toFixed(2)}</strong></li>
        <li>Net Profit/Loss: <strong className={totals.net >= 0 ? 'text-green-600' : 'text-red-600'}>€{totals.net.toFixed(2)}</strong></li>
      </ul>
    </div>
  );
}
