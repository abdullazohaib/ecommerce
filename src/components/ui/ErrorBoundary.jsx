import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetAdmin = () => {
    try {
      localStorage.removeItem('glowbasket_orders');
      localStorage.removeItem('glowbasket_products');
      localStorage.removeItem('glowbasket_categories');
      localStorage.removeItem('glowbasket_banners');
      localStorage.removeItem('glowbasket_store_info');
      localStorage.removeItem('glowbasket_reviews');
      localStorage.removeItem('glowbasket_about_section');
      window.location.href = '/admin/dashboard';
    } catch (e) {
      window.location.reload();
    }
  };

  handleResetStorage = () => {
    try {
      localStorage.clear();
      window.location.href = '/';
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6 text-center">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                {isAdminRoute ? 'Admin Panel Temporary Error' : 'Something went wrong'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAdminRoute 
                  ? 'A cached data conflict occurred in the admin dashboard. Click below to restore default catalog and reload.'
                  : 'A temporary display error occurred while rendering the store page.'}
              </p>
              {this.state.error && (
                <div className="bg-slate-100 text-slate-800 p-3 rounded-xl text-[11px] font-mono text-left overflow-x-auto max-h-32 border border-slate-200">
                  {this.state.error.toString()}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              {isAdminRoute ? (
                <button
                  onClick={this.handleResetAdmin}
                  className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-amber-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Admin Defaults</span>
                </button>
              ) : (
                <button
                  onClick={this.handleResetStorage}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Clear Cache & Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

