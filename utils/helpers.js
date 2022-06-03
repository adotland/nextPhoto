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
