export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${className}`} />;
}

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
