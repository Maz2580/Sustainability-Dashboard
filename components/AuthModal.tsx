import React, { useState } from 'react';

type Props = {
  onClose: () => void;
  onSubmit: (email: string) => unknown;
};

const AuthModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="bg-black/60 absolute inset-0" onClick={onClose} />
      <div className="relative bg-slate-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full z-50">
        <h3 className="text-lg font-semibold mb-2">Login / Request Access</h3>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full p-2 rounded mb-3 text-black" />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-slate-700 rounded">Cancel</button>
          <button onClick={() => onSubmit(email)} className="px-3 py-1 bg-sky-600 rounded">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
