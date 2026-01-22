"use client";

import { X } from "lucide-react";
import type { AIModel } from "@/types/model";

interface CompareModalProps {
  models: AIModel[];
  onClose: () => void;
}

export function CompareModal({ models, onClose }: CompareModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Model Comparison
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto p-6">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white px-4 py-3 text-left text-sm font-semibold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  Specification
                </th>
                {models.map((model) => (
                  <th
                    key={model.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    {model.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <CompareRow
                label="Provider"
                values={models.map((m) => m.provider)}
              />
              <CompareRow
                label="Parameters"
                values={models.map((m) => m.parameters)}
              />
              <CompareRow
                label="Context Length"
                values={models.map((m) => m.contextLength.toLocaleString())}
              />
              <CompareRow
                label="Quantization"
                values={models.map((m) => m.quantization)}
              />
              <CompareRow
                label="License"
                values={models.map((m) => m.license)}
              />
              <CompareRow
                label="Best For"
                values={models.map((m) => m.bestFor)}
              />
              <CompareRow
                label="Ollama Command"
                values={models.map((m) => m.ollamaCommand)}
                isCode
              />
              <CompareRow
                label="MMLU"
                values={models.map((m) => `${m.benchmarks.mmlu.toFixed(1)}%`)}
                highlight
              />
              <CompareRow
                label="HellaSwag"
                values={models.map((m) => `${m.benchmarks.hellaswag.toFixed(1)}%`)}
                highlight
              />
              <CompareRow
                label="ARC"
                values={models.map((m) => `${m.benchmarks.arc.toFixed(1)}%`)}
                highlight
              />
              <CompareRow
                label="Avg. Benchmark"
                values={models.map((m) =>
                  `${((m.benchmarks.mmlu + m.benchmarks.hellaswag + m.benchmarks.arc) / 3).toFixed(1)}%`
                )}
                highlight
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  values,
  highlight = false,
  isCode = false,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
  isCode?: boolean;
}) {
  const numericValues = highlight
    ? values.map((v) => parseFloat(v.replace("%", "")))
    : [];
  const maxValue = highlight ? Math.max(...numericValues) : 0;

  return (
    <tr>
      <td className="sticky left-0 bg-white px-4 py-3 text-sm font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
        {label}
      </td>
      {values.map((value, index) => {
        const isMax = highlight && numericValues[index] === maxValue;
        return (
          <td
            key={index}
            className={`px-4 py-3 text-sm ${
              isMax
                ? "font-semibold text-emerald-600 dark:text-emerald-400"
                : "text-zinc-700 dark:text-zinc-300"
            }`}
          >
            {isCode ? (
              <code className="rounded bg-zinc-100 px-2 py-1 font-mono text-xs dark:bg-zinc-800">
                {value}
              </code>
            ) : (
              value
            )}
          </td>
        );
      })}
    </tr>
  );
}
