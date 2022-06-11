import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Leaflet.module.css';
import osm from "../../cms/data/live/scripts/osm-providers";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useColorModeValue, Box, useColorMode } from '@chakra-ui/react';

const Leaflet = ({ center, name }) => {
  const { colorMode } = useColorMode()
  const [mapState, setMapState] = useState(null);
  const [currentTiles, setCurrentTiles] = useState(null);

  let tileProvider = useColorModeValue('jawgLight', 'jawgDark');

  useEffect(() => {
    if (!mapState) return
    if (mapState.hasLayer(currentTiles)) {
      currentTiles.remove()
    }
    let tileProvider = colorMode === 'light' ? 'jawgLight' : 'jawgDark';
    let tmp = L.tileLayer(osm[tileProvider].url, { attribution: osm[tileProvider].attribution })
    mapState.addLayer(tmp);
    setCurrentTiles(tmp)
  }, [colorMode])

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
    tap: false
  };

  function ChangeView({ center, }) {
    const map = useMap();
    map.setView(center, ZOOM);
    return null;
  }

  const markerIcon = new L.Icon({
    iconUrl: '/tree-t.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  })

  return (
    <Box
      justifyContent={['center', 'center', 'center', 'left']}
      boxShadow='inner'
      p={2}
      rounded='md'
      bg={useColorModeValue('white', 'blackAlpha.200')}
      maxW={['auto','auto','auto','25rem']}
    >
      <MapContainer
        className={styles.map}
        center={center}
        zoom={ZOOM}
        attributionControl={false}
        ref={setMapState}
        {...interactionOptions}
      >
        <ChangeView center={center} />
        <TileLayer
          url={osm[tileProvider].url}
          attribution={osm[tileProvider].attribution}
          ref={setCurrentTiles}
        />
        <Marker position={center} icon={markerIcon}>
        </Marker>
      </MapContainer>
    </Box>
  )
}

export default Leaflet;
