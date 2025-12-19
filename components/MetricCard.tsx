import React from 'react';
import { Metric } from '../types';

type Props = {
  metric: Metric;
  onClick?: () => void;
};

const MetricCard: React.FC<Props> = ({ metric, onClick }) => {
  return (
    <div onClick={onClick} className="p-4 bg-white/5 rounded-lg cursor-pointer">
      <div className="text-sm text-slate-300">{metric.name}</div>
      <div className="text-xs text-slate-400">{metric.description}</div>
    </div>
  );
};

export default MetricCard;
