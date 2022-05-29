import { ff } from "fssf";
import Gallery from "../../../components/Gallery";
// import { COLORS } from "../../../cms/config";

const COLORS = {
  PALETTE: {
    light: {
      hex: '#ffffff',
      rgb: { R: 255, G: 255, B: 255 },
    },
    brown: {
      hex: '#654321',
      rgb: { R: 101, G: 67, B: 33 },
    },
    blue: {
      hex: '87ceeb',
      rgb: { R: 135, G: 206, B: 235 },
    },
    green: {
      hex: '#37522c',
      rgb: { R: 55, G: 82, B: 44 }, // blend green
    },
    dark: {
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
  const data = await ff.readJson(ff.path('./cms/data/live/seattle.json'));
  return {
    props: {
      dataList: data.filter(d => d.filters?.matchColor?.toLowerCase() == value?.toLowerCase()),
      filterColor: value,
    }
  };
}

export default function ({ dataList, filterColor }) {
  return (
    <Gallery dataList={dataList} filterColor={filterColor} />
  )
}
