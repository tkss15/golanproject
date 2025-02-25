// components/ToastContainer.tsx
'use client'
import { useEffect } from 'react';
import { useToastStore } from '@/store/toast-store';
import { cn } from '@/lib/utils';
import { AnimatedList } from "@/components/ui/animated-ui";
import { Info, Check, AlertCircle, X, AlertTriangle } from 'lucide-react';

const typeToColor = {
  success: '#00C9A7',
  error: '#FF3D71',
  warning: '#FFB800',
  info: '#1E86FF',
};

const typeToIcon = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.time) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, parseInt(toast.time));

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-4 left-1/2 md:left-4 -translate-x-1/2 md:translate-x-0 h-[100px] md:h-[200px] overflow-hidden p-2 z-50 flex flex-col gap-2">
        <AnimatedList>
          {toasts.map((toast) => (
              <Notification  key={toast.id} id={toast.id} onDelete={removeToast} name={toast.name} description={toast.description} icon={toast.icon} color={typeToColor[toast.color as keyof typeof typeToColor]} time={toast.time} />
          ))}
        </AnimatedList>
     {toasts.length > 0 && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>}
    </div>
  );
};

const Notification = ({ id, name, description, icon, color, time, onDelete }: Item) => {
    const getIcon = () => {
        switch (icon) {
            case 'info':
                return <Info className='text-white' />
            case 'success':
                return <Check className='text-white' />
            case 'error':
                return <AlertCircle className='text-white' />
            case 'warning':
                return <AlertTriangle className='text-white' />
            default:
                return <Info className='text-white' />
        }
    }
    return (
      <figure
        onClick={() => onDelete(id)}
        className={cn(
          "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
          // animation styles
          "transition-all duration-200 ease-in-out hover:scale-[103%]",
          // light styles
          "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
          // dark styles
          "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        )}
      >
        <div className="flex flex-row items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: color,
            }}
          >
            <span className="text-lg">{getIcon()}</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
              <span className="text-sm sm:text-lg">{name}</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">{time}</span>
            </figcaption>
            <p className="text-sm font-normal dark:text-white/60">
              {description}
            </p>
          </div>
        </div>
      </figure>
    );
  };


interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  onDelete: (id: string) => void;
}

let notifications = [
  {
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",

    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();



export function AnimatedListDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
