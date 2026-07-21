import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

function isOnlineState(
  isConnected: boolean | null,
  isInternetReachable: boolean | null
): boolean {
  return isConnected === true && isInternetReachable !== false;
}

export function useIsOnline(): boolean {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let mounted = true;

    const updateFromState = (
      isConnected: boolean | null,
      isInternetReachable: boolean | null
    ) => {
      if (mounted) {
        setOnline(isOnlineState(isConnected, isInternetReachable));
      }
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      updateFromState(state.isConnected, state.isInternetReachable);
    });

    NetInfo.fetch().then((state) => {
      updateFromState(state.isConnected, state.isInternetReachable);
    });

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        NetInfo.fetch().then((state) => {
          updateFromState(state.isConnected, state.isInternetReachable);
        });
      }
    };

    const appStateSub = AppState.addEventListener('change', handleAppState);

    return () => {
      mounted = false;
      unsubscribe();
      appStateSub.remove();
    };
  }, []);

  return online;
}
