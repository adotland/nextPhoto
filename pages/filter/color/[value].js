import { ff } from "fssf";
import Gallery from "../../../components/Gallery";
// import { COLORS } from "../../../cms/config";

const FILTER_NAME = 'matchColor'

const COLORS = {
  PALETTE: {
    light: {
      hex: '#ffffff',
      rgb: { R: 255, G: 255, B: 255 },
    },
    earthy: {
      hex: '#654321',
      rgb: { R: 101, G: 67, B: 33 },
    },
    sky: {
      hex: '#4bb5d8',
      rgb: { R: 75, G: 181, B: 216 },
    },
    green: {
      hex: '#37522c',
      rgb: { R: 55, G: 82, B: 44 }, // blend green
    },
    bold: {
      hex: '#000000',
      rgb: { R: 0, G: 0, B: 0 },
    }
  }
};

export async function getStaticPaths() {
  const paths = Object.keys(COLORS.PALETTE);
  const displayable = paths.map(p => {
    return {
      params: { value: p }
    }
  });
  return {
    paths: displayable,
    fallback: false,
  }
}

export async function getStaticProps({ params: { value } }) {
  const collectionList = ['seattle', 'non-city'];
  const dataList = (await Promise.all(collectionList.map(async collection => await ff.readJson(ff.path(`./cms/data/live/${collection}_data.json`))))).flat();
  const filtered = dataList.filter(d => d.filters?.[FILTER_NAME]?.toLowerCase() == value?.toLowerCase());
  const retval = [];
  filtered.forEach(data => {
    if (data.filters.live) {
      retval.push({
        slug: data.slug,
        imageName: data.imageName,
        ext: data.ext,
        name: data.name,
        width: data.width,
        height: data.height,
      });
    }
  });
  return {
    props: {
      dataList: retval,
      filterColor: value,
    }
  };
}

export default function ({ dataList, filterColor }) {
  return (
    <Gallery dataList={dataList} filterColor={filterColor} />
  )
}
