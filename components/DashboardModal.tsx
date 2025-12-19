import React from 'react';
import { Metric, User } from '../types';

type Props = {
  metric: Metric;
  onClose: () => void;
  currentUser?: User | null;
  onEditDashboard?: (metric: Metric) => void;
};

const DashboardModal: React.FC<Props> = ({ metric, onClose, currentUser, onEditDashboard }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="bg-black/60 absolute inset-0" onClick={onClose} />
      <div className="relative bg-slate-800 text-white p-6 rounded-lg shadow-lg max-w-3xl w-full z-50">
        <h3 className="text-xl font-semibold mb-2">{metric.name}</h3>
        <p className="text-sm text-slate-300 mb-4">{metric.description}</p>
        <div className="space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-slate-700 rounded">Close</button>
          {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Editor') && (
            <button onClick={() => onEditDashboard && onEditDashboard(metric)} className="px-3 py-1 bg-sky-600 rounded">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;
