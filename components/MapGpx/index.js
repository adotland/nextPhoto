import dynamic from 'next/dynamic';

const MapFull = dynamic(() => import('./LeafletFull'), {
  ssr: false
});

export default MapFull;
