'use client';

import { useEffect } from 'react';

export interface BannerMessage {
  type: 'success' | 'error';
  text: string;
}

export default function MessageBanner({ message, onDismiss }: { message: BannerMessage | null; onDismiss: () => void }) {
  useEffect(() => {
    if (message) {
      const t = setTimeout(onDismiss, 3000);
      return () => clearTimeout(t);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={`mb-4 rounded-lg border px-4 py-3 text-sm transition-opacity duration-300 ${
        message.type === 'success'
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {message.text}
    </div>
  );
}
