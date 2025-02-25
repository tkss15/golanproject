// hooks/useToast.ts
import { useToastStore } from '@/store/toast-store';

export const useToast = () => {
  const { addToast, removeToast } = useToastStore();

  const toast = {
    success: (name: string, description: string, duration = 5000) => {
      addToast({ name, description, icon: 'success', color: 'success', time: duration.toString() });
    },
    error: (name: string, description: string, duration = 5000) => {
      addToast({ name, description, icon: 'error', color: 'error', time: duration.toString() });
    },
    warning: (name: string, description: string, duration = 5000) => {
      addToast({ name, description, icon: 'warning', color: 'warning', time: duration.toString() });
    },
    info: (name: string, description: string, duration = 5000) => {
      addToast({ name, description, icon: 'info', color: 'info', time: duration.toString() });
    },
  };

  return toast;
};