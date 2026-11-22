import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-2">
          <Layers className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">404</h1>
        <h2 className="text-lg font-semibold text-slate-200">Page not found</h2>
        <p className="text-xs text-slate-400">
          The page or view you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button icon={ArrowLeft} variant="primary">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
