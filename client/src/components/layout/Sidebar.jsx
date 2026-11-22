import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'My Tasks', to: '/tasks', icon: CheckSquare },
  { name: 'Board View', to: '/board', icon: Kanban },
  { name: 'Calendar', to: '/calendar', icon: Calendar },
  { name: 'Analytics', to: '/analytics', icon: BarChart2 },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col h-full bg-slate-900 border-r border-slate-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            TaskFlow
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v1.0
            </span>
          </span>
          <p className="text-[11px] text-slate-400 truncate">Productivity & Tasks</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Menu
        </p>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {user?.name ? user.name.substring(0, 2) : 'AK'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Alok Kumar'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'alok@example.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
