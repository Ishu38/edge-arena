"use client";

import { GitCompareArrows } from "lucide-react";

interface CompareButtonProps {
  selectedCount: number;
  onClick: () => void;
}

export function CompareButton({ selectedCount, onClick }: CompareButtonProps) {
  if (selectedCount < 2) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onClick}
        className="flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 dark:bg-blue-500 dark:shadow-blue-400/20 dark:hover:bg-blue-600"
      >
        <GitCompareArrows className="h-5 w-5" />
        <span>Compare {selectedCount} Models</span>
      </button>
    </div>
  );
}
