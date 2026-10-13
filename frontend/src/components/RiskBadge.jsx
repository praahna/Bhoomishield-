import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function RiskBadge({ level = 'LOW', score, size = 'md', showIcon = true }) {
  const normLevel = (level || 'LOW').toUpperCase();

  const configs = {
    LOW: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
      barColor: 'bg-emerald-500',
      Icon: ShieldCheck,
      label: 'Low Risk',
      textColor: 'text-emerald-600'
    },
    MEDIUM: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600',
      barColor: 'bg-amber-500',
      Icon: AlertTriangle,
      label: 'Medium Risk',
      textColor: 'text-amber-600'
    },
    HIGH: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      iconColor: 'text-rose-600',
      barColor: 'bg-rose-500',
      Icon: AlertOctagon,
      label: 'High Risk',
      textColor: 'text-rose-600'
    }
  };

  const current = configs[normLevel] || configs.LOW;
  const { Icon } = current;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${current.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${current.iconColor} shrink-0`} />}
      <span>{current.label}</span>
      {typeof score !== 'undefined' && score !== null && (
        <span className="ml-1 px-1.5 py-0.2 bg-white/70 rounded-full font-mono text-[11px] font-bold">
          {score}/100
        </span>
      )}
    </span>
  );
}
