import React from 'react';
import { AccessRequest } from '../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessRequests: AccessRequest[];
  approvedEditors: string[];
  onApprove: (email: string) => void;
  onDeny: (email: string) => void;
  onRevoke: (email: string) => void;
};

const AdminPanelModal: React.FC<Props> = ({ isOpen, onClose, accessRequests, approvedEditors, onApprove, onDeny, onRevoke }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="bg-black/60 absolute inset-0" onClick={onClose} />
      <div className="relative bg-slate-800 text-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50">
        <h3 className="text-lg font-semibold mb-3">Admin Panel</h3>
        <div className="mb-4">
          <h4 className="font-medium">Pending Requests</h4>
          {accessRequests.length === 0 ? <p className="text-sm text-slate-300">No requests</p> : (
            <ul className="space-y-2">
              {accessRequests.map(r => (
                <li key={r.id} className="flex justify-between items-center">
                  <span className="text-sm">{r.email}</span>
                  <div className="space-x-2">
                    <button onClick={() => onApprove(r.email)} className="px-2 py-1 bg-sky-600 rounded">Approve</button>
                    <button onClick={() => onDeny(r.email)} className="px-2 py-1 bg-slate-700 rounded">Deny</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="font-medium">Approved Editors</h4>
          {approvedEditors.length === 0 ? <p className="text-sm text-slate-300">None</p> : (
            <ul className="space-y-2">
              {approvedEditors.map(email => (
                <li key={email} className="flex justify-between items-center">
                  <span className="text-sm">{email}</span>
                  <button onClick={() => onRevoke(email)} className="px-2 py-1 bg-red-600 rounded">Revoke</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-slate-700 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelModal;
