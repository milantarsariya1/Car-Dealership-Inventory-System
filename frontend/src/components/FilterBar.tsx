import React from 'react';
import { Search, RefreshCw, SlidersHorizontal } from 'lucide-react';

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
    <div className="glass-panel p-5 rounded-[16px] mb-8 space-y-4 font-manrope bg-[#1c1634]/70 border border-[#a484d7]/20">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make, model, or VIN..."
            className="w-full bg-[#2b2344]/80 border border-[#a484d7]/30 text-white placeholder-white/40 pl-10 pr-4 py-2.5 rounded-[10px] text-sm focus:outline-none focus:border-[#7b39fc] focus:ring-1 focus:ring-[#7b39fc] transition-all font-inter"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar font-cabin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-[#7b39fc] text-white shadow-md shadow-purple-500/25 border border-[#7b39fc]'
                  : 'bg-[#2b2344]/60 text-white/70 hover:text-white hover:bg-[#2b2344] border border-[#a484d7]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action controls: Sort & Reset */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end font-cabin">
          <div className="flex items-center gap-2 bg-[#2b2344]/80 px-3 py-2 rounded-[10px] border border-[#a484d7]/30">
            <SlidersHorizontal className="w-4 h-4 text-white/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white/90 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#2b2344] text-white">Newest Arrival</option>
              <option value="price-asc" className="bg-[#2b2344] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#2b2344] text-white">Price: High to Low</option>
              <option value="stock-desc" className="bg-[#2b2344] text-white">Highest Stock</option>
            </select>
          </div>

          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-2.5 bg-[#2b2344]/80 hover:bg-[#392e5a] text-white/70 hover:text-white rounded-[10px] border border-[#a484d7]/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price Slider Bar */}
      <div className="pt-3 border-t border-[#a484d7]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-manrope">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-white/60 font-medium whitespace-nowrap">Max Price Filter:</span>
          <input
            type="range"
            min="10000"
            max="150000"
            step="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full sm:w-64 accent-[#7b39fc] cursor-pointer"
          />
          <span className="text-xs font-bold text-[#a484d7] min-w-[80px]">
            ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-xs text-white/40 hidden md:block">
          Showing real-time live stock inventory directly from database
        </p>
      </div>
    </div>
  );
};
