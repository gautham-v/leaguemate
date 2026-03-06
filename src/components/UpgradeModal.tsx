'use client';

import { useState } from 'react';
import { X, Lock, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase-browser';

interface UpgradeModalProps {
  leagueCount: number;
  onClose: () => void;
}

const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL!;
const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!;

async function startCheckout(priceId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Not signed in — redirect home where they can sign in
    window.location.href = '/';
    return;
  }

  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });

  if (!res.ok) {
    console.error('Checkout error', await res.text());
    return;
  }

  const { url } = await res.json() as { url: string };
  if (url) window.location.href = url;
}

export function UpgradeModal({ leagueCount, onClose }: UpgradeModalProps) {
  const [loadingPrice, setLoadingPrice] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setLoadingPrice(priceId);
    await startCheckout(priceId);
    setLoadingPrice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 border-b border-card-border/60">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
              <Lock size={15} className="text-brand-cyan" />
            </div>
            <h2 className="text-base font-bold text-white">Unlock all your leagues</h2>
          </div>
          <p className="text-sm text-gray-400">
            {leagueCount > 1
              ? `Switch between all ${leagueCount} leagues from one dashboard.`
              : 'Manage all your leagues from one persistent dashboard.'}
          </p>
        </div>

        {/* Feature list */}
        <div className="px-5 py-4 space-y-2.5">
          {[
            { icon: Zap, text: 'One-tap league switching' },
            { icon: Star, text: 'Saved leagues across sessions' },
            { icon: Zap, text: 'Future premium features included' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm text-gray-300">
              <Icon size={14} className="text-brand-cyan flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>

        {/* Pricing CTAs */}
        <div className="px-5 pb-5 space-y-2.5">
          {/* Annual — primary */}
          <Button
            className="w-full font-bold"
            size="lg"
            disabled={!!loadingPrice}
            onClick={() => handleCheckout(ANNUAL_PRICE_ID)}
          >
            {loadingPrice === ANNUAL_PRICE_ID ? 'Loading...' : 'Get Pro — $19.99 / year'}
          </Button>

          {/* Monthly — secondary */}
          <button
            onClick={() => handleCheckout(MONTHLY_PRICE_ID)}
            disabled={!!loadingPrice}
            className="w-full text-sm text-gray-400 hover:text-gray-200 transition-colors py-2 disabled:opacity-50"
          >
            {loadingPrice === MONTHLY_PRICE_ID ? 'Loading...' : 'or $2.99 / month'}
          </button>

          <p className="text-[10px] text-gray-600 text-center">
            Cancel anytime. Shared links always stay free.
          </p>
        </div>
      </div>
    </div>
  );
}
