'use client';

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, collection, query, where, getFirestore, CollectionReference, Query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

// A utility to memoize Firebase queries.
export const useMemoFirebase = <T>(
  createQuery: () => T,
  deps: React.DependencyList,
) => {
  return useMemo(createQuery, deps);
};


export function useCollection<T>(
  queryOrRef: ((db: Firestore) => CollectionReference | Query) | CollectionReference | Query | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const db = useFirestore();

  const memoizedQuery = useMemo(() => {
    if (!db || !queryOrRef) return null;
    return typeof queryOrRef === 'function' ? queryOrRef(db) : queryOrRef;
  }, [db, queryOrRef]);

  useEffect(() => {
    if (!memoizedQuery) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching collection:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading, error };
}
