'use client'

import React from 'react'
import { toast, Toast, ToastOptions } from 'react-hot-toast'

export const showToast = {
  success: (title: string, message: string): string => {
    return toast.success(title + ' - ' + message)
  },
  
  error: (title: string, message: string): string => {
    return toast.error(title + ' - ' + message)
  },
  
  info: (title: string, message: string): string => {
    return toast(title + ' - ' + message, {
      icon: '🔔',
    })
  },
  
  processing: (title: string, message: string): string => {
    return toast.loading(title + ' - ' + message, {
      duration: Infinity,
    })
  },
  
  delete: (title: string, message: string, onConfirm: () => void): string => {
    const toastId = toast(
      (t: Toast) => title + ' - ' + message + '\nClick to confirm deletion', 
      {
        duration: 5000,
        position: 'top-center',
        icon: '🗑️',
      } as ToastOptions
    );

    // Add event listener after creating toast
    toast.custom(
      (t) => {
        if (t.id === toastId) {
          onConfirm();
          toast.dismiss(toastId);
        }
        return null;
      },
      { id: toastId }
    );

    return toastId;
  }
}