import React, { useState } from 'react';
import { User, Sun, Moon, LogOut, ShieldCheck, Mail, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateProfile({ name: name.trim() });
      setSuccessMessage('Display name updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Account & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your TaskFlow profile, application theme, and session details
        </p>
      </div>

      {/* Profile Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Profile Information
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Your personal details and display identifier
          </p>
        </div>

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
          <Input
            label="Display Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-400">Email Address (Read-only)</label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 pl-9 pr-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400">Account email is tied to your primary identity.</p>
          </div>

          <Button type="submit" variant="primary" icon={Save} isLoading={isSaving}>
            Save Changes
          </Button>
        </form>
      </div>

      {/* Theme Preferences */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            Appearance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose your preferred interface theme
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-indigo-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-200">
                Current Theme: <span className="capitalize font-bold text-indigo-400">{theme} Mode</span>
              </p>
              <p className="text-xs text-slate-400">Toggle between Dark slate and Light clean interface</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Security & Thiranex Details */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> TaskFlow Internship Details
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified Project Metadata
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-slate-400">Developer</span>
            <p className="font-semibold text-slate-200 mt-0.5">Alok Kumar Vishwas</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-slate-400">Institution</span>
            <p className="font-semibold text-slate-200 mt-0.5">GL Bajaj Institute of Technology & Management</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-slate-400">Organization</span>
            <p className="font-semibold text-slate-200 mt-0.5">Thiranex Internship (Task 2)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-slate-400">Technology Stack</span>
            <p className="font-semibold text-slate-200 mt-0.5">React • Node.js • Prisma • PostgreSQL • Socket.IO</p>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-rose-300">Sign Out</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            End your current active session on this device.
          </p>
        </div>
        <Button variant="danger" onClick={logout} icon={LogOut} size="sm">
          Log Out
        </Button>
      </div>
    </div>
  );
};
