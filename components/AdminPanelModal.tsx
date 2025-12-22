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
      <div className="bg-black/30 absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white text-gray-800 rounded-2xl shadow-2xl max-w-2xl w-[90%] z-50 max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-2xl font-bold">Admin Panel</h3>
          <button onClick={onClose} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-all">Close</button>
        </div>
        <div className="p-8">
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Pending Access Requests</h4>
            {accessRequests.length === 0 ? (
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">No pending requests</p>
            ) : (
              <ul className="space-y-3">
                {accessRequests.map(r => (
                  <li key={r.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
                    <span className="text-gray-800 font-medium">{r.email}</span>
                    <div className="space-x-2">
                      <button onClick={() => onApprove(r.email)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all transform hover:scale-105 text-sm">Approve</button>
                      <button onClick={() => onDeny(r.email)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold transition-all transform hover:scale-105 text-sm">Deny</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Approved Editors</h4>
            {approvedEditors.length === 0 ? (
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">No approved editors yet</p>
            ) : (
              <ul className="space-y-3">
                {approvedEditors.map(email => (
                  <li key={email} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
                    <span className="text-gray-800 font-medium">{email}</span>
                    <button onClick={() => onRevoke(email)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all transform hover:scale-105 text-sm">Revoke</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelModal;
