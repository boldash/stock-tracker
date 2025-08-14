'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Task {
  id: string;
  ticker: string;
  price: number;
  note?: string;
  date: string;
  currentPrice: number;
}

export default function BuyBackTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'sell')
        .not('note', 'is', null);

      if (error || !data) return;

      const enriched = await Promise.all(
        data.map(async (t) => {
          const quote = await fetch(`/api/quote?ticker=${t.ticker}`).then((r) => r.json());
          return { ...t, currentPrice: quote?.c ?? 0 };
        })
      );

      setTasks(enriched);
    };

    fetchTasks();
  }, []);

  if (!tasks.length) return null;

  return (
    <div className="p-4 max-w-xl mx-auto mt-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">🔁 Buy-Back Task List</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-3 rounded">
            <div className="font-semibold">{task.ticker}</div>
            <div className="text-sm text-gray-600">
              Sold at: €{task.price.toFixed(2)} on {new Date(task.date).toLocaleDateString()}
            </div>
            <div className="text-sm">Note: {task.note || "—"}</div>
            <div className="mt-1">
              Current Price: <strong>€{task.currentPrice.toFixed(2)}</strong>
              {task.currentPrice < task.price * 0.9 && (
                <span className="ml-2 text-green-600 font-bold">🔔 Dip Detected</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
