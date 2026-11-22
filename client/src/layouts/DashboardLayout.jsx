import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { TaskModal } from '../components/tasks/TaskModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    activeDeleteModal,
    closeDeleteModal,
    deleteTask,
    notification,
    showNotification,
  } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!activeDeleteModal.task) return;
    setIsDeleting(true);
    try {
      await deleteTask(activeDeleteModal.task.id);
      closeDeleteModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <div className="relative w-64 h-full z-10">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="py-2.5 px-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-400">
          <span>TaskFlow • Built for Thiranex Internship by </span>
          <span className="font-semibold text-slate-400">Alok Kumar Vishwas</span>
          <span> (GL Bajaj ITM)</span>
        </footer>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <ConfirmModal
        isOpen={activeDeleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        message={
          activeDeleteModal.task
            ? `Are you sure you want to delete "${activeDeleteModal.task.title}"? This cannot be undone.`
            : null
        }
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl animate-slide-up text-xs font-medium text-slate-200">
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {notification.type === 'info' && <Info className="w-4 h-4 text-indigo-400" />}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};
