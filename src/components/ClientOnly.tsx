/* eslint-disable react-hooks/set-state-in-effect */
// src/components/ClientOnly.tsx
'use client';
import { ReactNode, useState, useEffect } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function ClientOnly({ children, fallback = null }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return fallback;

  return <>{children}</>;
}