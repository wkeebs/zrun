import { Loader2 } from "lucide-react";

export function LoadingSpinner({ 
  size = 24, 
  className = "", 
  message = "Loading..." 
}: { 
  size?: number, 
  className?: string, 
  message?: string 
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 w-full h-full">
      <Loader2 
        className={`animate-spin text-primary ${className}`} 
        size={size} 
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size={48} />
    </div>
  );
}