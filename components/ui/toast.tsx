/**
 * Toast Component
 * 
 * Simple toast notification component.
 * Note: This is a simplified implementation. For production, consider using a library.
 */

"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if context is not available
    return {
      toast: (toast: Omit<Toast, "id">) => {
        console.log("Toast:", toast);
      },
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...newToast, id }]);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                "flex items-center gap-4 rounded-lg border p-4 shadow-lg bg-background min-w-[300px]",
                toast.variant === "destructive" && "border-destructive"
              )}
            >
              <div className="flex-1">
                <div
                  className={cn(
                    "font-semibold",
                    toast.variant === "destructive" && "text-destructive"
                  )}
                >
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {toast.description}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => dismiss(toast.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function Toaster() {
  // This component is kept for compatibility but ToastProvider handles rendering
  return null;
}
