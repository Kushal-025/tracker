import React from 'react';

export default function StatCard({ title, amount, icon: Icon, gradient, subtitle }) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border border-white/10 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 bg-linear-to-br ${gradient} text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/70 text-sm font-medium tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-bold mt-2 tracking-tight">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {subtitle && (
        <p className="text-xs text-white/80 mt-4 font-medium flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}