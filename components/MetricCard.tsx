import React from 'react';
import { Metric } from '../types';

type Props = {
  metric: Metric;
  onClick?: () => void;
};

const MetricCard: React.FC<Props> = ({ metric, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="group relative p-6 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100/60 hover:border-blue-300 overflow-hidden animate-fade-in-up"
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-400/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-400/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none rounded-2xl" />
      
      {/* Subtle animated border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
        style={{
          background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.2), transparent)',
        }}
      />

      <div className="relative z-10 flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{metric.name}</h3>
          {/* Animated underline */}
          <div className="h-0.5 w-0 group-hover:w-12 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 mt-2" />
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative z-10">{metric.description}</p>
      
      {/* Visual badge indicator */}
      <div className="mt-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 group-hover:animate-pulse" />
          <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700">Interactive</span>
        </div>
        <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
          <span className="text-sm font-semibold">Explore</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
