import { create } from 'zustand';
import { router } from 'expo-router';
import { useConnect, useActiveAccount, useDisconnect } from 'thirdweb/react';
import { inAppWallet } from 'thirdweb/wallets/in-app';
import { client, citreaTestnet } from '~/lib/thirdweb';

interface User {
  id: string;
  email: string;
  fullName?: string;
  walletAddress?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const wallet = inAppWallet();

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      // Connect with Google on Citrea testnet
      const account = await wallet.connect({
        client,
        strategy: "google",
        chain: citreaTestnet,
      });

      const walletAddress = account.address;

      // You might want to get user info from Google here
      const user = {
        id: walletAddress || '1',
        email: 'user@gmail.com', // Get from Google profile
        fullName: 'Google User', // Get from Google profile
        walletAddress,
      };

      set({
        user,
        isAuthenticated: true,
      });

      router.push('/map');
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true });
    try {
      // Connect with Apple on Citrea testnet
      const account = await wallet.connect({
        client,
        strategy: "apple",
        chain: citreaTestnet,
      });

      const walletAddress = account.address;

      // You might want to get user info from Apple here
      const user = {
        id: walletAddress || '1',
        email: 'user@icloud.com', // Get from Apple profile
        fullName: 'Apple User', // Get from Apple profile
        walletAddress,
      };

      set({
        user,
        isAuthenticated: true,
      });

      router.push('/map');
    } catch (error) {
      console.error('Apple sign in failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      // Disconnect wallet
      if (wallet) {
        await wallet.disconnect();
      }

      set({
        user: null,
        isAuthenticated: false,
      });

      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
