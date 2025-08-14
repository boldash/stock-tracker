import HoldingForm from "../components/HoldingForm";
import Dashboard from "../components/Dashboard";
import TransactionForm from "../components/TransactionForm";
import Ledger from "../components/Ledger";
import BuyBackTasks from "../components/BuyBackTasks";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-2xl font-bold">📈 Stock Portfolio Tracker</h1>
      <HoldingForm />
      <Dashboard />
      <TransactionForm />
      <Ledger />
      <BuyBackTasks />
    </main>
  );
}
