export function swalTheme(isDark: boolean) {
  return {
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    customClass: {
      popup: isDark
        ? 'rounded-3xl border border-white/10'
        : 'rounded-3xl border border-slate-200',
      confirmButton: 'rounded-xl px-5 py-2.5 font-black uppercase tracking-widest text-[10px]',
      cancelButton: 'rounded-xl px-5 py-2.5 font-black uppercase tracking-widest text-[10px]',
    },
  }
}
