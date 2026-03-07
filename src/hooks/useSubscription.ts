'use client';

// Phase 0: All features free — no paywall until we have PostHog engagement data
// to determine what to gate. Re-enable subscription checks in Phase 2.
// Original implementation preserved below for when we activate the paywall.
export function useSubscription(): { isPro: boolean; isLoading: boolean; cancelAtPeriodEnd: boolean; periodEnd: string | null } {
  return { isPro: true, isLoading: false, cancelAtPeriodEnd: false, periodEnd: null };
}

/* --- Original subscription check (Phase 2) ---
export function _useSubscriptionWithPaywall(): { isPro: boolean; isLoading: boolean; cancelAtPeriodEnd: boolean; periodEnd: string | null } {
  const { user, loading: userLoading } = useSupabaseUser();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      setIsPro(false);
      setCancelAtPeriodEnd(false);
      setPeriodEnd(null);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('subscriptions')
      .select('status, cancel_at_period_end, current_period_end, cancel_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data }) => {
        setIsPro(!!data);
        const isCanceling = data?.cancel_at_period_end || !!data?.cancel_at;
        setCancelAtPeriodEnd(isCanceling ?? false);
        setPeriodEnd(data?.cancel_at ?? data?.current_period_end ?? null);
        setIsLoading(false);
      });
  }, [user, userLoading]);

  return { isPro, isLoading, cancelAtPeriodEnd, periodEnd };
}
*/
