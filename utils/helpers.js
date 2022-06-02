export function byWeight(a, b) {
  return (b.filters?.weight || 0) - (a.filters?.weight || 0);
}

export function byColor(a, b) {
  return (Number.parseInt(b.filters?.matchColor?.substring(1), 16) - Number.parseInt(a.filters?.matchColor?.substring(1), 16));
}
