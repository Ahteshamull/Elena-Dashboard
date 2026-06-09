/**
 * Simple utility to merge tailwind classes since we can't install tailwind-merge or clsx
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
