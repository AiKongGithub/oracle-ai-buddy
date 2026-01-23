'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Liff } from '@line/liff';
import type {
  LiffState,
  LiffActions,
  LiffProfile,
  LiffContext,
  LiffMessage,
} from './types';

// LIFF Context
interface LiffContextValue extends LiffState, LiffActions {}

const LiffContext = createContext<LiffContextValue | null>(null);

// LIFF Provider Props
interface LiffProviderProps {
  children: ReactNode;
  liffId: string;
}

export function LiffProvider({ children, liffId }: LiffProviderProps) {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [state, setState] = useState<LiffState>({
    isLoggedIn: false,
    isInClient: false,
    isReady: false,
    profile: null,
    context: null,
    error: null,
  });

  // Initialize LIFF
  useEffect(() => {
    const initLiff = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const liffModule = await import('@line/liff');
        const liffInstance = liffModule.default;

        await liffInstance.init({ liffId });

        const isLoggedIn = liffInstance.isLoggedIn();
        const isInClient = liffInstance.isInClient();

        // Get context
        let context: LiffContext | null = null;
        try {
          const liffContext = liffInstance.getContext();
          if (liffContext) {
            context = {
              type: liffContext.type,
              viewType: liffContext.viewType,
              userId: liffContext.userId,
              utouId: liffContext.utouId,
              roomId: liffContext.roomId,
              groupId: liffContext.groupId,
            };
          }
        } catch {
          // Context not available in external browser
        }

        // Get profile if logged in
        let profile: LiffProfile | null = null;
        if (isLoggedIn) {
          try {
            const liffProfile = await liffInstance.getProfile();
            profile = {
              userId: liffProfile.userId,
              displayName: liffProfile.displayName,
              pictureUrl: liffProfile.pictureUrl,
              statusMessage: liffProfile.statusMessage,
            };
          } catch {
            // Profile not available
          }
        }

        setLiff(liffInstance);
        setState({
          isLoggedIn,
          isInClient,
          isReady: true,
          profile,
          context,
          error: null,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isReady: true,
          error: error instanceof Error ? error : new Error('LIFF init failed'),
        }));
      }
    };

    if (liffId) {
      initLiff();
    }
  }, [liffId]);

  // Actions
  const login = useCallback(() => {
    if (liff && !state.isLoggedIn) {
      liff.login();
    }
  }, [liff, state.isLoggedIn]);

  const logout = useCallback(() => {
    if (liff && state.isLoggedIn) {
      liff.logout();
      setState((prev) => ({
        ...prev,
        isLoggedIn: false,
        profile: null,
      }));
    }
  }, [liff, state.isLoggedIn]);

  const getProfile = useCallback(async (): Promise<LiffProfile | null> => {
    if (!liff || !state.isLoggedIn) return null;
    try {
      const profile = await liff.getProfile();
      const liffProfile: LiffProfile = {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };
      setState((prev) => ({ ...prev, profile: liffProfile }));
      return liffProfile;
    } catch {
      return null;
    }
  }, [liff, state.isLoggedIn]);

  const sendMessages = useCallback(
    async (messages: LiffMessage[]) => {
      if (!liff || !state.isInClient) {
        throw new Error('sendMessages only works in LINE app');
      }
      // Cast to any to avoid complex LIFF type compatibility issues
      await liff.sendMessages(messages as Parameters<typeof liff.sendMessages>[0]);
    },
    [liff, state.isInClient]
  );

  const shareTargetPicker = useCallback(
    async (messages: LiffMessage[]) => {
      if (!liff) {
        throw new Error('LIFF not initialized');
      }
      if (!liff.isApiAvailable('shareTargetPicker')) {
        throw new Error('shareTargetPicker not available');
      }
      // Cast to any to avoid complex LIFF type compatibility issues
      await liff.shareTargetPicker(messages as Parameters<typeof liff.shareTargetPicker>[0]);
    },
    [liff]
  );

  const closeWindow = useCallback(() => {
    if (liff) {
      liff.closeWindow();
    }
  }, [liff]);

  const openWindow = useCallback(
    (url: string, external = false) => {
      if (liff) {
        liff.openWindow({ url, external });
      }
    },
    [liff]
  );

  const scanCode = useCallback(async (): Promise<string | null> => {
    if (!liff || !state.isInClient) {
      throw new Error('scanCode only works in LINE app');
    }
    if (!liff.isApiAvailable('scanCodeV2')) {
      throw new Error('scanCode not available');
    }
    const result = await liff.scanCodeV2();
    return result?.value || null;
  }, [liff, state.isInClient]);

  const value = useMemo<LiffContextValue>(
    () => ({
      ...state,
      login,
      logout,
      getProfile,
      sendMessages,
      shareTargetPicker,
      closeWindow,
      openWindow,
      scanCode,
    }),
    [
      state,
      login,
      logout,
      getProfile,
      sendMessages,
      shareTargetPicker,
      closeWindow,
      openWindow,
      scanCode,
    ]
  );

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
}

// Hook to use LIFF
export function useLiff(): LiffContextValue {
  const context = useContext(LiffContext);
  if (!context) {
    throw new Error('useLiff must be used within a LiffProvider');
  }
  return context;
}

// HOC for optional LIFF (when not in LINE)
export function useOptionalLiff(): LiffContextValue | null {
  return useContext(LiffContext);
}
