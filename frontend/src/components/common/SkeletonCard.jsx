import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/60 animate-pulse space-y-4">
      <div className="h-44 bg-slate-200 dark:bg-slate-700 rounded-xl w-full" />
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-700/60">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3" />
      </div>
    </div>
  );
};

export default SkeletonCard;
