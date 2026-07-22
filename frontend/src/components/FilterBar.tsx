import React from 'react';
import { Search, Filter, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { Category } from '../types';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onReset: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Electric (EV)', value: 'EV' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'Sedan', value: 'SEDAN' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Coupe', value: 'COUPE' },
  { label: 'Truck', value: 'TRUCK' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onReset,
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make, model, or VIN..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action controls: Sort & Reset */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900 text-slate-200">Newest Arrival</option>
              <option value="price-asc" className="bg-slate-900 text-slate-200">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900 text-slate-200">Price: High to Low</option>
              <option value="stock-desc" className="bg-slate-900 text-slate-200">Highest Stock</option>
            </select>
          </div>

          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price Slider Bar */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Max Price Filter:</span>
          <input
            type="range"
            min="10000"
            max="150000"
            step="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full sm:w-64 accent-cyan-500 cursor-pointer"
          />
          <span className="text-xs font-bold text-cyan-400 min-w-[80px]">
            ${maxPrice.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-slate-500 hidden md:block">
          Showing real-time live stock inventory directly from database
        </p>
      </div>
    </div>
  );
};
