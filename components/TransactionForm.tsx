'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TransactionForm() {
  const [form, setForm] = useState({
    ticker: '',
    type: 'buy',
    amount: '',
    price: '',
    note: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('transactions').insert([
      {
        ticker: form.ticker,
        type: form.type,
        amount: parseFloat(form.amount),
        price: parseFloat(form.price),
        note: form.note,
        date: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert('Error saving transaction: ' + error.message);
    } else {
      alert('Transaction saved!');
      setForm({ ticker: '', type: 'buy', amount: '', price: '', note: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 border rounded mt-8">
      <h2 className="text-lg font-semibold">Log Transaction</h2>
      <input name="ticker" value={form.ticker} onChange={handleChange} placeholder="Ticker (e.g. NVDA)" className="w-full border p-2" required />
      <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2">
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount (shares)" className="w-full border p-2" required />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price per share" className="w-full border p-2" required />
      <input name="note" value={form.note} onChange={handleChange} placeholder="Optional note" className="w-full border p-2" />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save Transaction</button>
    </form>
  );
}
