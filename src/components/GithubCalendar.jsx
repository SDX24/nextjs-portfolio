"use client";

import dynamic from 'next/dynamic';

const GitHubCalendar = dynamic(() => import('./github-calendar'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading GitHub activity...</div>
});

export default function GitHubCalendarWrapper() {
  return <GitHubCalendar />;
}