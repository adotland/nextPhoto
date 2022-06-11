import { dataList } from './featured_data'

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function byColor(a, b) {
  return (Number.parseInt(b.filters?.matchColor?.substring(1), 16) - Number.parseInt(a.filters?.matchColor?.substring(1), 16));
}

export default async function handler(req, res) {

  const sorted = shuffle(dataList).sort(byColor)
  const retval = [];
  sorted.forEach(data => {
    if (data.filters.live && data.filters.featured) {
      retval.push({
        slug: data.slug,
        imageName: data.imageName,
        ext: data.ext,
        parkName: data.parkName,
        width: data.width,
        height: data.height,
      });
    }
  })
  return res.status(200).json({ props: { dataList: retval.slice(0, 12) } });
}
