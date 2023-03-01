// inspired by https://rehooks.github.io/local-storage/index.html and https://react-hookz.github.io/web/?path=/docs/side-effect-uselocalstoragevalue--example
// the following implementation is the best of these two

import {useEffect, useState} from 'react';

export const useStorage = <T, D = null | T>(
  key: string,
  defaultValue: D | null = null
) => {
  const [data, setData] = useState<D extends null ? T | null : T>(
    defaultValue as D extends null ? T | null : T
  );

  const updateData = (data: D extends null ? T | null : T) => {
    setData(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      setData(JSON.parse(storedData) as D extends null ? T | null : T);
    }
  }, [key]);

  useEffect(() => {
    const onStorageEvent = (event: StorageEvent) => {
      if (event.key !== key) return;
      if (event.storageArea !== localStorage) return;
      const newValue = event.newValue;
      if (!newValue) return;
      if (newValue === JSON.stringify(data)) return;

      setData(JSON.parse(newValue) as D extends null ? T | null : T);
    };

    window.addEventListener('storage', onStorageEvent);
    return () => window.removeEventListener('storage', onStorageEvent);
  }, [key, data]);

  return [data, updateData] as const;
};
