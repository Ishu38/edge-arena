"use client";

import { useState } from "react";
import { Cpu, Layers, Ruler, Target, Building2, Check, Copy, Terminal } from "lucide-react";
import type { AIModel } from "@/types/model";

interface ModelCardProps {
  model: AIModel;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function ModelCard({ model, isSelected = false, onToggleSelect }: ModelCardProps) {
  const [copied, setCopied] = useState(false);

  const avgBenchmark = (
    (model.benchmarks.mmlu + model.benchmarks.hellaswag + model.benchmarks.arc) /
    3
  ).toFixed(1);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(model.ollamaCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`group relative rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 ${isSelected ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"}`}>
      {/* Selection Checkbox */}
      <button
        onClick={() => onToggleSelect?.(model.id)}
        className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${isSelected ? "border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400" : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-zinc-500"}`}
        aria-label={isSelected ? "Deselect model" : "Select model for comparison"}
      >
        {isSelected && <Check className="h-4 w-4" />}
      </button>

      {/* Header */}
      <div className="mb-4 flex items-start justify-between pr-8">
        <div className="flex items-center gap-3">
          {/* Company Logo Placeholder */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <Building2 className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {model.name}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {model.provider}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {avgBenchmark}%
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {model.description}
      </p>

      {/* Specs Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Cpu className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <span>{model.parameters}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Ruler className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <span>{model.contextLength.toLocaleString()} ctx</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Layers className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <span>{model.quantization}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Target className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <span>{model.bestFor}</span>
        </div>
      </div>

      {/* Benchmarks */}
      <div className="mb-4 space-y-2">
        <BenchmarkBar label="MMLU" value={model.benchmarks.mmlu} />
        <BenchmarkBar label="HellaSwag" value={model.benchmarks.hellaswag} />
        <BenchmarkBar label="ARC" value={model.benchmarks.arc} />
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {model.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Ollama Command */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 dark:bg-zinc-950">
          <Terminal className="h-4 w-4 flex-shrink-0 text-zinc-500" />
          <code className="flex-1 overflow-x-auto text-sm text-zinc-300">
            {model.ollamaCommand}
          </code>
          <button
            onClick={handleCopy}
            className="relative flex-shrink-0 rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Copy command"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {/* Copied tooltip */}
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-emerald-400 whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function BenchmarkBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-zinc-500 dark:text-zinc-500">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-12 text-right text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}
