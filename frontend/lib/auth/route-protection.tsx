'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context'; // Assuming the context you showed is in this file
import { FullPageLoader } from '@/components/loading-spinner';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    // Show full-page loader while checking authentication
    if (isLoading) {
      return <FullPageLoader />;
    }

    // Render wrapped component if authenticated
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
}