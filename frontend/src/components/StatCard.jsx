export default function StatCard({ label, value, accent = "brand" }) {
  const accents = {
    brand: "text-brand-600",
    green: "text-emerald-600",
    amber: "text-amber-600",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accents[accent] || accents.brand}`}>{value}</p>
    </div>
  );
}
