'use client';

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, doc, getFirestore, DocumentReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

export function useDoc<T>(
  docRefOrFn: ((db: Firestore) => DocumentReference) | DocumentReference | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const db = useFirestore();

  const memoizedDocRef = useMemo(() => {
    if (!db || !docRefOrFn) return null;
    return typeof docRefOrFn === 'function' ? docRefOrFn(db) : docRefOrFn;
  }, [db, docRefOrFn]);

  useEffect(() => {
    if (!memoizedDocRef) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null); // Document does not exist
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching document:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  return { data, loading, error };
}
