'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/dashboard'); // replace pour cleaner l'URL (enlever le hash)
      } else {
        router.replace('/auth');
      }
    };
    checkSession();
  }, []);

  return <div>Redirection en cours...</div>; // Ou un loader sympa
}