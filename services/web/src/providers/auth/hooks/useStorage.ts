// inspired by https://rehooks.github.io/local-storage/index.html and https://react-hookz.github.io/web/?path=/docs/side-effect-uselocalstoragevalue--example
// the following implementation is the best of these two

import {useEffect, useState} from 'react';

export const useStorage = <T>(key: string) => {
  const [data, setData] = useState<T | null>(null);

  const updateData = (data: any) => {
    setData(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const onStorageEvent = (event: StorageEvent) => {
      if (event.key !== key) return;
      if (event.storageArea !== localStorage) return;

      const storedData = localStorage.getItem(key);
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    };

    window.addEventListener('storage', onStorageEvent);
    return () => window.removeEventListener('storage', onStorageEvent);
  });

  return [data, updateData] as const;
};
