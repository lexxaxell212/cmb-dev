import placeholder from '../assets/images/placeholder.webp';

export function resolveImage(value?: string): string {
  if (value && /^https?:\/\//i.test(value)) return value;
  return placeholder;
}