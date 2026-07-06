'use client';

export default function InlineEditField({
  value,
  onChange,
  onSave,
  onCancel,
  mobile,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  mobile?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSave();
        if (e.key === 'Escape') onCancel();
      }}
      className={`w-full rounded-lg border border-orange-400 text-sm text-neutral-800 outline-none ring-1 ring-orange-400 ${
        mobile ? 'px-3 py-2' : 'px-2 py-1.5'
      }`}
      autoFocus
    />
  );
}
