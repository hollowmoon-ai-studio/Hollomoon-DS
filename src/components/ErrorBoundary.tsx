import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Home, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; resetErrorBoundary: () => void }) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public resetErrorBoundary = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleResetCacheAndReload = (): void => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore storage clear errors
    }
    window.location.hash = '';
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.hash = '';
    this.resetErrorBoundary();
  };

  private handleCopyDiagnostics = (): void => {
    const { error, errorInfo } = this.state;
    const diagnostics = [
      `Timestamp: ${new Date().toISOString()}`,
      `Error: ${error?.name}: ${error?.message}`,
      `Stack: ${error?.stack || 'N/A'}`,
      `Component Stack: ${errorInfo?.componentStack || 'N/A'}`,
      `URL: ${window.location.href}`,
      `User Agent: ${navigator.userAgent}`,
    ].join('\n\n');

    navigator.clipboard.writeText(diagnostics).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    }).catch(() => {
      // Clipboard write fallback
    });
  };

  private toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render(): ReactNode {
    const { hasError, error, errorInfo, showDetails, copied } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      if (typeof fallback === 'function') {
        return fallback({
          error: error || new Error('Unknown runtime error'),
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }
      return fallback;
    }

    return (
      <div className="min-h-screen w-full bg-[#0A0A0C] text-[#D9DBE1] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#4F7FFF]/30">
        {/* Ambient atmospheric backdrop */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F7FFF]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-red-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative w-full max-w-2xl bg-[#121217]/90 backdrop-blur-2xl border border-[#23232C] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Header indicator */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400 shadow-inner">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                  Runtime Protection
                </span>
                <span className="text-xs text-[#8C909E] font-mono">
                  Hollowmoon Studio
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                Initialization Exception
              </h1>
              <p className="text-sm text-[#8C909E] mt-1 leading-relaxed">
                The application encountered an unexpected runtime error during execution. Your local workspace state is protected.
              </p>
            </div>
          </div>

          {/* Error Message Preview */}
          <div className="mt-6 p-3.5 rounded-xl bg-[#0A0A0C]/80 border border-[#23232C] text-sm font-mono text-red-300 break-words flex items-start gap-2.5">
            <span className="text-red-400 flex-shrink-0 mt-0.5">›</span>
            <span className="flex-1">{error?.message || 'An unknown initialization error occurred.'}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={this.resetErrorBoundary}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white text-sm font-medium transition-all shadow-md hover:shadow-[#4F7FFF]/25 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B1B22] hover:bg-[#23232C] border border-[#23232C] text-[#D9DBE1] text-sm font-medium transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reload Page
            </button>

            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B1B22] hover:bg-[#23232C] border border-[#23232C] text-[#D9DBE1] text-sm font-medium transition-all cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Return Home
            </button>

            <button
              onClick={this.handleResetCacheAndReload}
              title="Clears saved localStorage settings and resets"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs text-[#8C909E] hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer ml-auto"
            >
              Clear Cache & Reset
            </button>
          </div>

          {/* Diagnostics Accordion */}
          <div className="mt-6 pt-5 border-t border-[#23232C]">
            <div className="flex items-center justify-between">
              <button
                onClick={this.toggleDetails}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C909E] hover:text-white transition-colors cursor-pointer"
              >
                {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                <span>{showDetails ? 'Hide technical diagnostics' : 'Show technical diagnostics'}</span>
              </button>

              <button
                onClick={this.handleCopyDiagnostics}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C909E] hover:text-white px-2.5 py-1 rounded bg-[#1B1B22] hover:bg-[#23232C] border border-[#23232C] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Diagnostics</span>
                  </>
                )}
              </button>
            </div>

            {showDetails && (
              <div className="mt-3 p-4 rounded-xl bg-[#0A0A0C] border border-[#23232C] overflow-x-auto text-[11px] font-mono leading-relaxed text-[#8C909E] space-y-3 max-h-64 overflow-y-auto">
                <div>
                  <div className="text-red-400 font-semibold mb-1">Error Stack:</div>
                  <pre className="whitespace-pre-wrap text-red-300/80">{error?.stack || 'No stack trace available'}</pre>
                </div>
                {errorInfo?.componentStack && (
                  <div>
                    <div className="text-[#4F7FFF] font-semibold mb-1">Component Stack:</div>
                    <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                  </div>
                )}
                <div>
                  <div className="text-white font-semibold mb-1">Environment Info:</div>
                  <p>URL: {window.location.href}</p>
                  <p>User Agent: {navigator.userAgent}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
