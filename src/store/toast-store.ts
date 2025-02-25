import { create } from 'zustand'

interface Toast {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => 
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36) }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));