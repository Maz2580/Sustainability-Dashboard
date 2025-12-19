import React from 'react';
import { User } from '../types';

type Props = {
  user: User;
  onLogout: () => void;
  onAdminPanelClick?: () => void;
};

const UserMenu: React.FC<Props> = ({ user, onLogout, onAdminPanelClick }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-slate-200">{user.email}</span>
      {user.role === 'Admin' && (
        <button onClick={onAdminPanelClick} className="px-2 py-1 bg-slate-700 rounded text-sm">Admin</button>
      )}
      <button onClick={onLogout} className="px-2 py-1 bg-red-600 rounded text-sm">Logout</button>
    </div>
  );
};

export default UserMenu;
