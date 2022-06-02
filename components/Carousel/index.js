import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Carousel'), {
  ssr: false
});

export default Map;
