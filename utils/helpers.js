export function byWeight(a, b) {
  return (b.filters?.weight || 0) - (a.filters?.weight || 0);
}

export function byColor(a, b) {
  return (Number.parseInt(b.filters?.matchColor?.substring(1), 16) - Number.parseInt(a.filters?.matchColor?.substring(1), 16));
}

export function byFeatured(a, b) {
  return (b.filters?.featured - a.filters?.featured);
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shimmer(w, h) {
  return `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#999" offset="20%" />
      <stop stop-color="#aaa" offset="50%" />
      <stop stop-color="#999" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#aaa" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`
}

export function toBase64(str) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
}

export const commonBlurImage = toBase64(shimmer(4032, 3024));
