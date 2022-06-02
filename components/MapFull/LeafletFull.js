import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LeafletFull.module.css';
import osm from "../../cms/data/osm-providers";

import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents } from 'react-leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useColorModeValue } from '@chakra-ui/react';

const LeafletFull = ({ dataList, loadData, getParksInBounds }) => {

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
  const center = [47.6092355, -122.317784] // seattle univ

  const markerIcon = new L.Icon({
    iconUrl: '/tree-t.png'
  })

  // <a href="https://www.flaticon.com/free-icons/christmas-tree" title="christmas tree icons">Christmas tree icons created by Pixel perfect - Flaticon</a>


  function MapEventListener() {
    const map = useMapEvents({
      zoom: () => {
        const bounds = map.getBounds()
        getParksInBounds({north: bounds.getNorth(), south: bounds.getSouth(), east: bounds.getEast(), west: bounds.getWest()})
      },
      moveend: () => {
        const bounds = map.getBounds()
        getParksInBounds({north: bounds.getNorth(), south: bounds.getSouth(), east: bounds.getEast(), west: bounds.getWest()})
        console.log({north: bounds.getNorth(), south: bounds.getSouth(), east: bounds.getEast(), west: bounds.getWest()})

      },
    })
    return null
  }


  return (
    <MapContainer
      className={styles.map}
      center={center}
      zoom={12}
      scrollWheelZoom={false}
    >
      <MapEventListener />
      <TileLayer
        url={osm[tileProvider].url}
        attribution={osm[tileProvider].attribution}
      />
      {dataList.map(data => {
        if (data.lat && data.long) {
          return (<Marker
            position={[data.lat, data.long]}
            icon={markerIcon}
            eventHandlers={{
              click: (e) => {
                loadData(data.slug);
              },
            }}
          >
            <Popup >
              {data.name}
            </Popup>
          </Marker>)
        }
      })}
    </MapContainer>
  )
}

export default LeafletFull;
