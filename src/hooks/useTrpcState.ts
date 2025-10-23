import { useEffect, useState } from 'react';

export function useTrpcState() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleStateChange = () => {
      console.log('State change detected, refreshing...');
      setRefreshKey(prev => prev + 1);
    };

    // Listen to custom events
    window.addEventListener('trpc-state-change', handleStateChange);

    return () => {
      window.removeEventListener('trpc-state-change', handleStateChange);
    };
  }, []);

  return refreshKey;
}
