"use client"

import { Toaster as SonnerToaster } from "sonner"
import { useTheme } from "next-themes"

export function ToastProvider() {
  const { theme } = useTheme()

  return (
    <SonnerToaster 
      position="bottom-right"
      theme={theme as "light" | "dark" | "system"} 
      richColors
      closeButton
    />
  )
}