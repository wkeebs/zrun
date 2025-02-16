'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface ActionButtonProps {
  children: React.ReactNode;
  className?: string;
  route: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, className, route }) => {
  const router = useRouter();

  return (
    <Button 
      size="lg" 
      className={className}
      onClick={() => router.push(route)}
    >
      {children}
      <ChevronRight className="ml-2 h-5 w-5" />
    </Button>
  );
};

export default ActionButton;