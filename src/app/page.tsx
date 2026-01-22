"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { ModelCard } from "@/components/ModelCard";
import { CompareButton } from "@/components/CompareButton";
import { CompareModal } from "@/components/CompareModal";
import type { AIModel } from "@/types/model";
import models from "@/data/models.json";

type LicenseFilter = "All" | "MIT" | "Apache 2.0" | "Commercial";
type SortOrder = "smallest" | "largest";

function parseParameters(params: string): number {
  const match = params.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [licenseFilter, setLicenseFilter] = useState<LicenseFilter>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("smallest");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const filteredAndSortedModels = useMemo(() => {
    const result = (models as AIModel[]).filter((model) => {
      const matchesSearch = model.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLicense =
        licenseFilter === "All" || model.license === licenseFilter;
      return matchesSearch && matchesLicense;
    });

    result.sort((a, b) => {
      const aSize = parseParameters(a.parameters);
      const bSize = parseParameters(b.parameters);
      return sortOrder === "smallest" ? aSize - bSize : bSize - aSize;
    });

    return result;
  }, [searchQuery, licenseFilter, sortOrder]);

  const selectedModels = useMemo(() => {
    return (models as AIModel[]).filter((model) => selectedIds.has(model.id));
  }, [selectedIds]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "smallest" ? "largest" : "smallest"));
  };

  const toggleModelSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openCompareModal = () => {
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Edge Arena: Live & Deployed
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Compare small AI models for edge deployment
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
            />
          </div>

          <div className="flex gap-3">
            {/* License Filter Dropdown */}
            <div className="relative">
              <select
                value={licenseFilter}
                onChange={(e) =>
                  setLicenseFilter(e.target.value as LicenseFilter)
                }
                className="appearance-none rounded-lg border border-zinc-300 bg-white py-2 pl-4 pr-10 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="All">All Licenses</option>
                <option value="MIT">MIT</option>
                <option value="Apache 2.0">Apache 2.0</option>
                <option value="Commercial">Commercial</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>

            {/* Sort Button */}
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "smallest" ? "Smallest First" : "Largest First"}
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Showing {filteredAndSortedModels.length} of {models.length} models
          {selectedIds.size > 0 && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              ({selectedIds.size} selected)
            </span>
          )}
        </p>

        {/* Model Grid */}
        {filteredAndSortedModels.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedIds.has(model.id)}
                onToggleSelect={toggleModelSelection}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">
              No models found matching your criteria.
            </p>
          </div>
        )}
      </main>

      {/* Floating Compare Button */}
      <CompareButton
        selectedCount={selectedIds.size}
        onClick={openCompareModal}
      />

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CompareModal models={selectedModels} onClose={closeCompareModal} />
      )}
    </div>
  );
}
