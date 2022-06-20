import dynamic from 'next/dynamic';

const MapExp = dynamic(() => import('./LeafletExp.js'), {
  ssr: false
});

export default MapExp;
