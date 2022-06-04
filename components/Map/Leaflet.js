import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Leaflet.module.css';
import osm from "../../cms/data/live/scripts/osm-providers";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useColorModeValue } from '@chakra-ui/react';

const Leaflet = ({ center, name }) => {

  const ZOOM = 11;

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

  const interactionOptions = {
    zoomControl: false,
    doubleClickZoom: false,
    closePopupOnClick: false,
    dragging: false,
    zoomSnap: true,
    zoomDelta: true,
    trackResize: true,
    touchZoom: false,
    scrollWheelZoom: false,
  };

  function ChangeView({ center, }) {
    const map = useMap();
    map.setView(center, ZOOM);
    return null;
  }

  return (
    <MapContainer className={styles.map} center={center} zoom={ZOOM} {...interactionOptions}>
      <ChangeView center={center} />
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
