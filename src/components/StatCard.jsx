import React from 'react';

export default function StatCard({ title, amount, icon: Icon, gradient, subtitle }) {
  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br ${gradient} text-white`}>
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="text-white/70 text-xs sm:text-sm font-medium tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight break-words">₹{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
      {subtitle && (
        <p className="text-[11px] sm:text-xs text-white/80 mt-4 font-medium flex items-center gap-1 break-words">
          {subtitle}
        </p>
      )}
    </div>
  );
}