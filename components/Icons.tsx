
import React from 'react';

const makeIcon = (pathD: string) => ({ className = '' }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d={pathD} />
  </svg>
);

export const BookOpenIcon = makeIcon('M3 7.5A2.5 2.5 0 015.5 5H20');
export const EnergyIcon = makeIcon('M12 2v6l4 2-4 8V8');
export const WaterIcon = makeIcon('M12 2C12 2 8 7 8 10a4 4 0 008 0c0-3-4-8-4-8z');
export const WasteIcon = makeIcon('M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6');
export const EmissionsIcon = makeIcon('M3 12h3v4H3z M8 8h3v8H8z M13 4h3v12h-3z');
export const UpTrendIcon = makeIcon('M3 17l6-6 4 4 8-8');
export const DownTrendIcon = makeIcon('M21 7l-6 6-4-4-8 8');
export const UsersIcon = makeIcon('M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2');
export const ShoppingCartIcon = makeIcon('M3 3h2l.4 2M7 13h10l4-8H5.4');
export const BuildingOfficeIcon = makeIcon('M3 21V3h18v18H3z M7 7h2v2H7z M11 7h2v2h-2z');
export const AcademicCapIcon = makeIcon('M12 2L1 7l11 5 9-4.09V17h2V7z');
export const PublicationIcon = makeIcon('M12 2v6l8 4-8 4-8-4 8-4V2z');
export const FlaskIcon = makeIcon('M7 2h10l-3 8v6a3 3 0 01-6 0V10L7 2z');
export const PlaneIcon = makeIcon('M2 12l20-8-6 8 6 8-20-8z');
export const CogIcon = makeIcon('M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z');

export default {};
