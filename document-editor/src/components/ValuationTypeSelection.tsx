import { ArrowLeft, Home, Building2, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { ValuationType } from '../types';
import { cn } from '../utils/cn';

const VALUATION_TYPES: ValuationType[] = [
  {
    id: 'property',
    name: 'Property Valuation',
    icon: 'building',
    description: 'Flats, Apartments, Houses, Commercial Buildings',
  },
  {
    id: 'plot',
    name: 'Plot Valuation',
    icon: 'land',
    description: 'Land, Agricultural Plots, Residential Plots',
  },
];

export default function ValuationTypeSelection() {
  const { selectedBank, setSelectedBank, setSelectedValuationType } = useStore();

  const handleTypeSelect = (type: ValuationType) => {
    setSelectedValuationType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 backdrop-blur-lg bg-white/80 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedBank(null)}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors tap-highlight-transparent"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedBank?.name}
            </h2>
            <p className="text-sm text-slate-600">
              Select valuation type
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ backgroundColor: selectedBank?.color }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Valuation Type
            </h1>
            <p className="text-slate-600">
              Choose the type of property to valuate
            </p>
          </div>

          {/* Valuation Type Cards */}
          <div className="space-y-3">
            {VALUATION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type)}
                className={cn(
                  'w-full flex items-center justify-between p-5 rounded-2xl',
                  'bg-white shadow-sm border-2 border-transparent',
                  'transition-all duration-200 tap-highlight-transparent',
                  'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
                  'group'
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: selectedBank?.color + '20' }}
                  >
                    {type.icon === 'building' ? (
                      <Building2 className="w-6 h-6" style={{ color: selectedBank?.color }} />
                    ) : (
                      <Home className="w-6 h-6" style={{ color: selectedBank?.color }} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">{type.name}</p>
                    <p className="text-sm text-slate-500">{type.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
