export function Logo({ store, brand }: { store: string; brand: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="12" fill="#d7ecf7" />
        <path
          d="M20 8c-3.2 0-6 2.4-6.6 5.6-.7 3.8.6 7.6 2.4 11.1 1.1 2.2 2.4 4.1 4.2 5.6.5.4 1.3.4 1.8 0 1.8-1.5 3.1-3.4 4.2-5.6 1.8-3.5 3.1-7.3 2.4-11.1C26 10.4 23.2 8 20 8Z"
          fill="#3f86b0"
        />
        <path
          d="M17.2 16.2c.9-1.4 2.6-1.4 3.5 0 .6.9.6 2.1 0 3-.9 1.4-2.6 1.4-3.5 0-.6-.9-.6-2.1 0-3Z"
          fill="#f4fbff"
        />
      </svg>
      <span className="leading-tight">
        <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700">
          {store}
        </span>
        <span className="block text-sm font-semibold text-slate-800">
          {brand}
        </span>
      </span>
    </span>
  );
}
