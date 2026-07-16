'use client';

function ArrowUp({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export default function ReorderControls({
  index,
  total,
  onMoveUp,
  onMoveDown,
  compact,
  showHash,
  disabled,
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  compact?: boolean;
  showHash?: boolean;
  disabled?: boolean;
}) {
  const btnClass = compact
    ? 'flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:cursor-pointer hover:text-neutral-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:cursor-not-allowed'
    : 'flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 disabled:opacity-20';

  return (
    <div className="flex items-center gap-1">
      <button onClick={onMoveUp} disabled={disabled || index === 0} className={btnClass}>
        <ArrowUp className="h-3 w-3" />
      </button>
      <span className={`text-center text-neutral-500 ${compact ? 'w-4 text-sm' : 'text-sm'}`}>
        {showHash ? '#' : ''}{index + 1}
      </span>
      <button onClick={onMoveDown} disabled={disabled || index === total - 1} className={btnClass}>
        <ArrowDown className="h-3 w-3" />
      </button>
    </div>
  );
}
