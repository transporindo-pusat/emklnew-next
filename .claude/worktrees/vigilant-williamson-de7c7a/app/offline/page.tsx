'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WifiOff, RefreshCw, Home, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [returnPath, setReturnPath] = useState('/dashboard');

  useEffect(() => {
    const stored = sessionStorage.getItem('offline_return_path');
    if (stored) setReturnPath(stored);
  }, []);

  const verifyConnection = useCallback(async (): Promise<boolean> => {
    // navigator.onLine can be a false positive, so we probe an actual request
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
        sessionStorage.removeItem('offline_return_path');
        router.push(returnPath);
      }, 1_200);
    }
  }, [verifyConnection, returnPath, router]);

  // Auto-handle browser "online" event
  useEffect(() => {
    const handleOnline = () => void handleRetry();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [handleRetry]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 p-6">
      {/* Icon */}
      <div
        className={cn(
          'mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-colors duration-500',
          isOnline ? 'bg-green-50' : 'bg-white'
        )}
      >
        {isOnline ? (
          <Wifi className="text-green-500" size={44} />
        ) : (
          <WifiOff className="text-slate-400" size={44} />
        )}
      </div>

      {/* Heading */}
      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        {isOnline ? 'Koneksi Pulih' : 'Tidak Ada Koneksi Internet'}
      </h1>

      <p className="mb-8 max-w-sm text-center text-sm leading-relaxed text-slate-500">
        {isOnline
          ? 'Jaringan terdeteksi. Mengarahkan kembali ke halaman sebelumnya...'
          : 'Permintaan gagal karena jaringan internet terputus saat proses sedang berlangsung. Periksa koneksi Anda lalu coba lagi.'}
      </p>

      {/* Status badge */}
      <div
        className={cn(
          'mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold',
          isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        )}
      >
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            isOnline ? 'bg-green-500' : 'animate-pulse bg-red-500'
          )}
        />
        {isOnline ? 'Online' : 'Offline'}
      </div>

      {/* Actions */}
      {!isOnline && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => void handleRetry()}
            disabled={isChecking}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <RefreshCw
              className={cn('h-4 w-4', isChecking && 'animate-spin')}
            />
            {isChecking ? 'Memeriksa...' : 'Coba Lagi'}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem('offline_return_path');
              router.push('/dashboard');
            }}
            className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <Home className="h-4 w-4" />
            Ke Dashboard
          </Button>
        </div>
      )}

      {isOnline && (
        <div className="flex items-center gap-2 text-green-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          <span className="text-sm font-medium">Mengalihkan...</span>
        </div>
      )}

      {/* Footer hint */}
      {!isOnline && (
        <p className="mt-10 text-xs text-slate-400">
          Halaman akan otomatis mendeteksi saat koneksi kembali.
        </p>
      )}
    </div>
  );
}
