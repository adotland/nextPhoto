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

export function capFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function debounce(limit, callback) {
  let timeoutId
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(callback, limit, args)
  }
}

export function percentage(x, y) {
  return 100 / (y / x)
}


// LatLng {lat: 47.560035580011096, lng: -122.31904141792397}
// _northEast: LatLng
// lat: 47.56177315221082
// lng: -122.310941146699
// [[Prototype]]: Object
// _southWest: LatLng
// lat: 47.55829795018273
// lng: -122.32714168914895


export function getBounds(lat, long, zoom = 12) {
  const latCoef = zoom === 12 ? 0.027775532 : 0.0017376010140459641;
  const longCoef = zoom === 12 ? 0.049438476 : 0.008100271224975586;
  return {
    north: lat + latCoef,
    south: lat - latCoef,
    east: long + longCoef,
    west: long - longCoef
  }
}

export function findParksInBounds(list, bounds, amount) {
  return list.filter(data => {
    let withinBounds = false;
    if ((data.lat && (data.lat > bounds.south)) && (data.lat && (data.lat < bounds.north)) && (data.long && (data.long > bounds.west)) && (data.long && (data.long < bounds.east))) {
      withinBounds = true;
    }
    return withinBounds;
  })
    .slice(0, amount);
}
