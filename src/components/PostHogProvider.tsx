'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init('phc_NncEJss9Imfc7umKmeEc0FXegzy8Mv6CN2yteqxtyMR', {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      capture_pageview: false, // handled manually via PostHogPageView
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: { password: true },
      },
      autocapture: true,
      capture_exceptions: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
