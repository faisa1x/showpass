import React, { useState } from 'react';
import { X, MapPin, Search, Check } from 'lucide-react';
import { CITIES } from '../data/moviesData';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (cityId: string) => void;
}

export const CityModal: React.FC<CityModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularCities = CITIES.filter(c => c.popular);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#1c1c20] border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#f84464]" />
            <h3 className="text-lg font-bold text-white">Select Your City</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search for your city (e.g. Mumbai, Delhi, Bengaluru)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#f84464] transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Popular Cities Grid */}
        {!searchTerm && (
          <div className="px-6 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Popular Cities
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {popularCities.map(city => {
                const isSelected = city.id === selectedCity;
                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city.id);
                      onClose();
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#f84464]/10 border-[#f84464] text-white shadow-sm'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl mb-1">{city.icon}</span>
                    <span className="text-xs font-medium truncate max-w-full">{city.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All / Filtered Cities List */}
        <div className="px-6 py-4 max-h-60 overflow-y-auto custom-scrollbar border-t border-white/5 mt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {searchTerm ? `Search Results (${filteredCities.length})` : 'All Cities'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredCities.map(city => {
              const isSelected = city.id === selectedCity;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#f84464] text-white font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{city.icon}</span>
                    <div className="truncate">
                      <div className="truncate">{city.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500'} truncate`}>
                        {city.state}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Cinema listings and showtimes adapt automatically</span>
          <button 
            onClick={onClose}
            className="text-white hover:underline font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
