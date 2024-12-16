'use client'

import React from 'react'
import toast from 'react-hot-toast'
import { CustomToast } from '@/components/ui/CustomToast'

interface ToastType {
  visible: boolean;
  id: string;
}

export const showToast = {
  success: (title: string, message: string) => {
    return toast.custom((t: ToastType) => React.createElement(CustomToast, {
      visible: t.visible,
      type: 'success',
      title,
      message,
      onClose: () => toast.dismiss(t.id)
    }))
  },

  error: (title: string, message: string) => {
    return toast.custom((t: ToastType) => React.createElement(CustomToast, {
      visible: t.visible,
      type: 'error',
      title,
      message,
      onClose: () => toast.dismiss(t.id)
    }))
  },

  delete: (title: string, message: string, onConfirm: () => void) => {
    return toast.custom((t: ToastType) => React.createElement(CustomToast, {
      visible: t.visible,
      type: 'delete',
      title,
      message,
      onClose: () => toast.dismiss(t.id),
      onConfirm: () => {
        onConfirm()
        toast.dismiss(t.id)
      }
    }), {
      duration: 5000
    })
  }
} 