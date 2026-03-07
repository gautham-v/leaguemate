'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { DraftLeaderboard } from '@/components/DraftLeaderboard';
import { RookieTargetsTab } from '@/components/RookieTargetsTab';
import { ShareButton } from '@/components/ShareButton';

type DraftPageTab = 'analysis' | 'rookies';

function getRookieSeasonDefaults() {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const isRookieSeason = month >= 2 && month <= 5; // March–June
  const nflDraftDate = new Date(`${now.getFullYear()}-04-23`);
  const daysUntilDraft = Math.ceil((nflDraftDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const showCountdown = daysUntilDraft > 0 && daysUntilDraft <= 90;
  return { isRookieSeason, daysUntilDraft, showCountdown };
}

function getCountdownDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('draft-countdown-dismissed') === 'true';
}

export default function DraftPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const router = useRouter();
  const { daysUntilDraft, showCountdown } = getRookieSeasonDefaults();
  const [activeTab, setActiveTab] = useState<DraftPageTab>('rookies');
  const [countdownDismissed, setCountdownDismissed] = useState(getCountdownDismissed);

  const dismissCountdown = () => {
    localStorage.setItem('draft-countdown-dismissed', 'true');
    setCountdownDismissed(true);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Draft Hub</h2>
        <ShareButton className="mt-0.5" />
      </div>

      {showCountdown && !countdownDismissed && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
          <span className="text-base">🏈</span>
          <span className="text-sm text-amber-400 flex-1">
            <span className="font-semibold">NFL Draft in {daysUntilDraft} days</span>
          </span>
          <button
            onClick={dismissCountdown}
            className="text-amber-400/60 hover:text-amber-400 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex border-b border-card-border mb-5">
        <button
          onClick={() => setActiveTab('rookies')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'rookies'
              ? 'border-brand-cyan text-white'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
        >
          Draft Board
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'analysis'
              ? 'border-brand-cyan text-white'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
        >
          Draft Leaderboard
        </button>
      </div>

      {activeTab === 'analysis' && (
        <DraftLeaderboard
          leagueId={leagueId}
          onSelectManager={(uid) => router.push(`/league/${leagueId}/managers/${uid}`)}
        />
      )}
      {activeTab === 'rookies' && <RookieTargetsTab leagueId={leagueId} />}
    </div>
  );
}
