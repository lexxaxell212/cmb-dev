import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TOAST_STYLES: Record<ToastKind, string> = {
  success: 'border-green-600/60',
  error: 'border-accent',
  info: 'border-wood-mid/40',
};

const TOAST_ICONS: Record<ToastKind, string> = {
  success: 'fa-solid fa-circle-check text-green-500',
  error: 'fa-solid fa-circle-exclamation text-accent',
  info: 'fa-solid fa-circle-info text-wood-light',
};

const DURATION_MS = 3500;

let nextId = 0;

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++nextId;
    setToasts((list) => [...list, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, DURATION_MS);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-md border bg-wood-dark/95 px-4 py-3 text-sm shadow-lg shadow-wood-darkest/40 backdrop-blur animate-toast-in ${TOAST_STYLES[toast.kind]}`}
            role="status"
          >
            <span className="flex items-start gap-2.5">
              <i className={`${TOAST_ICONS[toast.kind]} mt-0.5 text-base`} aria-hidden="true" />
              <span className="text-wood-text">{toast.message}</span>
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}