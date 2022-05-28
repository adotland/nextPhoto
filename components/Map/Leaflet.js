import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Leaflet.module.css';
import osm from "../../cms/data/osm-providers";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useColorModeValue } from '@chakra-ui/react';

const Leaflet = ({ center, name }) => {

  useEffect(() => {
    (async function init() {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetinaUrl.src,
        iconUrl: iconUrl.src,
        shadowUrl: shadowUrl.src,
      });
    })();
  }, []);

  const tileProvider = useColorModeValue('jawgLight', 'jawgDark');

  return (
    <MapContainer className={styles.map} center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url={osm[tileProvider].url}
        attribution={osm[tileProvider].attribution}
      />
      <Marker position={center}>
        <Popup>
          {name}
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Leaflet;
