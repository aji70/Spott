import React, { createContext, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '~/hooks/useAuth';
import { LoadingScreen } from '~/components/LoadingScreen';

interface AuthContextType {
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Only proceed if we have segments (router is ready)
    if (segments.length === 0) return;

    const onIndexPage = segments.length === 1 && segments[0] === 'index';
    const onRootPage = segments.length === 0 || (segments.length === 1 && segments[0] === '');
    const onAuthPage = onIndexPage || onRootPage;

    if (!isAuthenticated && !onAuthPage) {
      // Redirect to the sign-in page.
      router.replace('/');
    } else if (isAuthenticated && onAuthPage) {
      // Redirect away from the sign-in page.
      router.replace('/map');
    }
  }, [isAuthenticated, segments, router]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, signInWithGoogle, signInWithApple, signOut } = useAuth();

  useProtectedRoute(isAuthenticated);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
