import dynamic from 'next/dynamic';

const IG = dynamic(() => import('./Embed.js'), {
  ssr: false
});

export default IG;
