import React from 'react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 group focus:outline-none transition-all duration-300 ${className}`}
      aria-label="University of Melbourne Sustainability Dashboard"
    >
      {/* University of Melbourne Official Logo */}
      <div className="relative shadow-lg hover:shadow-xl transform group-hover:scale-110 transition-all duration-300 group-hover:-translate-y-1">
        <img
          src="/logo_uni.png"
          alt="University of Melbourne"
          className="h-12 w-auto drop-shadow-md"
        />
      </div>

      {/* Text Logo */}
      <div className="hidden sm:flex flex-col -space-y-1">
        <span className="text-xs font-bold text-blue-300 tracking-widest">UNIVERSITY OF MELBOURNE</span>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-black text-white tracking-tight">SUSTAINABILITY</span>
          <span className="text-xs font-bold text-blue-400 tracking-widest">DASHBOARD</span>
        </div>
      </div>

      {/* Animated underline on hover */}
      <div className="hidden sm:block absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
    </button>
  );
};

export default Logo;
