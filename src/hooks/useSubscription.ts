'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useSupabaseUser } from './useSupabaseUser';

export function useSubscription(): { isPro: boolean; isLoading: boolean } {
  const { user, loading: userLoading } = useSupabaseUser();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      setIsPro(false);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data }) => {
        setIsPro(!!data);
        setIsLoading(false);
      });
  }, [user, userLoading]);

  return { isPro, isLoading };
}
