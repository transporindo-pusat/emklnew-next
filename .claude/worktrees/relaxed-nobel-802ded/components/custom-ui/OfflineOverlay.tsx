'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WifiOff, Wifi, RefreshCw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  useOfflineOverlay,
  offlineOverlayStore
} from '@/lib/store/client/useOfflineOverlay';

export default function OfflineOverlay() {
  const { isVisible, returnPath, hide } = useOfflineOverlay();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Probe a real HTTP request — navigator.onLine can be a false positive
  const verifyConnection = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) return false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5_000);
    try {
      await fetch('/favicon.ico', {
        cache: 'no-store',
        signal: controller.signal
      });
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  const handleRetry = useCallback(async () => {
    setIsChecking(true);
    const connected = await verifyConnection();
    setIsChecking(false);

    if (connected) {
      setIsOnline(true);
      setTimeout(() => {
        hide();
        setIsOnline(false);
        // returnPath was saved at the moment the request failed
        router.push(returnPath);
      }, 1_000);
    }
  }, [verifyConnection, hide, returnPath, router]);

  // Auto-detect when connection is restored
  useEffect(() => {
    if (!isVisible) return;
    const handleOnline = () => void handleRetry();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [isVisible, handleRetry]);

  // Reset local state whenever overlay is hidden
  useEffect(() => {
    if (!isVisible) {
      setIsOnline(false);
      setIsChecking(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Tidak ada koneksi internet"
      className="fixed inset-0 z-[2147483646] flex items-center justify-center bg-slate-50 p-4 dark:bg-zinc-950"
    >
      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/40">
        {/* Status badge */}
        <div className="mb-6 flex justify-center">
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors duration-300',
              isOnline
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
            )}
          >
            <span className="relative flex h-2 w-2">
              {!isOnline && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              )}
              <span
                className={cn(
                  'relative inline-flex h-2 w-2 rounded-full',
                  isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                )}
              />
            </span>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors duration-500',
              isOnline
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'
            )}
          >
            {isOnline ? (
              <Wifi className="h-7 w-7" strokeWidth={2} />
            ) : (
              <WifiOff className="h-7 w-7" strokeWidth={2} />
            )}
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-center text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {isOnline ? 'Koneksi Pulih' : 'Tidak Ada Koneksi Internet'}
        </h1>

        <p className="mx-auto mb-7 max-w-sm text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {isOnline
            ? 'Jaringan terdeteksi. Mengarahkan kembali ke halaman sebelumnya...'
            : 'Permintaan gagal karena jaringan internet terputus. Periksa koneksi Anda lalu coba lagi.'}
        </p>

        {/* Actions */}
        {!isOnline && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() => void handleRetry()}
              disabled={isChecking}
              className="flex-1 gap-2 bg-slate-900 text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <RefreshCw
                className={cn('h-4 w-4', isChecking && 'animate-spin')}
              />
              {isChecking ? 'Memeriksa...' : 'Coba Lagi'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                offlineOverlayStore.getState().hide();
                router.push('/dashboard');
              }}
              className="flex-1 gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
            >
              <Home className="h-4 w-4" />
              Ke Dashboard
            </Button>
          </div>
        )}

        {isOnline && (
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm font-medium">Mengalihkan...</span>
          </div>
        )}

        {/* Footer hint */}
        {!isOnline && (
          <div className="mt-7 border-t border-slate-100 pt-4 dark:border-white/5">
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              Halaman akan otomatis mendeteksi saat koneksi kembali.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
