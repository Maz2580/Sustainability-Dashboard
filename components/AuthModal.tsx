import React, { useState } from 'react';

type Props = {
  onClose: () => void;
  onSubmit: (email: string) => unknown;
};

const AuthModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center animate-fade-in-up">
      <div className="bg-black/40 absolute inset-0 backdrop-blur-md transition-all duration-300" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-white via-blue-50/40 to-white text-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl max-w-md w-full z-50 animate-scale-in border border-blue-100/40 overflow-hidden">
        {/* Animated background gradient decoration */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl animate-floating" />
        </div>

        <div className="relative z-10">
          <h3 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent mb-2 animate-slide-in-left">Access Portal</h3>
          <p className="text-gray-600 text-sm mb-8 font-light animate-slide-in-left stagger-1">Sign in or request access to the dashboard</p>
          
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="email@example.com" 
            className="w-full px-5 py-3 rounded-xl mb-8 text-gray-800 border-2 border-blue-200/60 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300/40 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium animate-fade-in-up stagger-2 hover:border-blue-300" 
          />
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-6 py-3 bg-gray-200/60 text-gray-800 rounded-xl hover:bg-gray-300/80 font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-gray-300/40 animate-slide-in-left stagger-3">Cancel</button>
            <button onClick={() => onSubmit(email)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl animate-slide-in-right stagger-3">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
