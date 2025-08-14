'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function HoldingForm() {
  const [formData, setFormData] = useState({
    stock_name: '',
    ticker: '',
    shares: '',
    avg_price: '',
    currency: 'EUR',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('holdings').insert([
      {
        stock_name: formData.stock_name,
        ticker: formData.ticker,
        shares: parseFloat(formData.shares),
        avg_price: parseFloat(formData.avg_price),
        currency: formData.currency,
      },
    ]);

    if (error) {
      alert('Error saving data: ' + error.message);
    } else {
      alert('Holding saved!');
      setFormData({
        stock_name: '',
        ticker: '',
        shares: '',
        avg_price: '',
        currency: 'EUR',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 border rounded">
      <input name="stock_name" value={formData.stock_name} onChange={handleChange} placeholder="Stock Name" className="w-full border p-2" required />
      <input name="ticker" value={formData.ticker} onChange={handleChange} placeholder="Ticker (e.g. NVDA)" className="w-full border p-2" required />
      <input name="shares" type="number" value={formData.shares} onChange={handleChange} placeholder="Shares" className="w-full border p-2" required />
      <input name="avg_price" type="number" value={formData.avg_price} onChange={handleChange} placeholder="Average Buy Price" className="w-full border p-2" required />
      <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-2">
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Holding</button>
    </form>
  );
}
