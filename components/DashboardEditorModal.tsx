import React from 'react';
import { Metric, Widget } from '../types';

type Props = {
  metric: Metric;
  isOpen: boolean;
  onClose: () => void;
  onSave: (metricId: string, newWidgets: Widget[]) => void;
};

const DashboardEditorModal: React.FC<Props> = ({ metric, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="bg-black/60 absolute inset-0" onClick={onClose} />
      <div className="relative bg-slate-800 text-white p-6 rounded-lg shadow-lg max-w-3xl w-full z-50">
        <h3 className="text-lg font-semibold mb-2">Edit Dashboard: {metric.name}</h3>
        <p className="text-sm text-slate-300 mb-4">This is a lightweight editor stub.</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-slate-700 rounded mr-2">Cancel</button>
          <button onClick={() => onSave(metric.id, metric.data.widgets)} className="px-3 py-1 bg-sky-600 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEditorModal;
