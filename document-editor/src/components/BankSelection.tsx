import { Building2, ChevronRight, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { BANKS } from '../utils/banks';
import { cn } from '../utils/cn';

export default function BankSelection() {
  const { currentUser, logout } = useStore();
  const setSelectedBank = useStore((state) => state.setSelectedBank);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* User Info & Logout */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm">
            <p className="text-slate-500">Welcome back,</p>
            <p className="font-semibold text-slate-900">{currentUser?.fullName}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl hover:bg-red-50 active:bg-red-100 text-red-600 transition-colors tap-highlight-transparent"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Document Editor
          </h1>
          <p className="text-slate-600">
            Select your bank to get started
          </p>
        </div>

        {/* Bank Cards */}
        <div className="space-y-3">
          {BANKS.map((bank) => (
            <button
              key={bank.code}
              onClick={() => setSelectedBank(bank)}
              className={cn(
                'w-full flex items-center justify-between p-5 rounded-2xl',
                'bg-white shadow-sm border-2 border-transparent',
                'transition-all duration-200 tap-highlight-transparent',
                'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
                'group'
              )}
              style={{
                borderColor: 'transparent',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: bank.color }}
                >
                  {bank.code}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">{bank.name}</p>
                  <p className="text-sm text-slate-500">Code: {bank.code}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Choose the bank associated with your documents
          </p>
        </div>
      </div>
    </div>
  );
}
