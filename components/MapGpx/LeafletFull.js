import { useColorModeValue, useColorMode } from "@chakra-ui/react";
import { useEffect, useState, useRef, forwardRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./LeafletFull.module.css";
import osm from "../../data/scripts/osm-providers";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
  useMap,
  LayerGroup,
} from "react-leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line react/display-name
const GpxLayer = forwardRef(({ routeData }, ref) => {
  const map = useMap();

  useEffect(() => {
    const layer = new L.Polyline(routeData.positions, {
      // pathOptions: { fillColor: 'red', color: 'blue' },

    });
    if (map.hasLayer(layer)) return;
    layer.addTo(map);
    // map.setView(layer.getCenter());
    map.fitBounds(layer.getBounds().pad(0.3));
    // map.setMaxBounds(layer.getBounds().pad(0.5));
    ref.current = layer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
});

const LeafletFull = ({
  dataList,
  loadData,
  getParksInBounds,
  activeCarouselItem,
  setActiveCarouselItem,
  activeMarker,
  routeData,
}) => {
  const { colorMode } = useColorMode();
  const [mapState, setMapState] = useState(null);
  const [currentTiles, setCurrentTiles] = useState(null);
  const [markersObj, setMarkersObj] = useState({});
  const [markerRefObj, setMarkerRefObj] = useState({});

  let tileProvider = useColorModeValue("jawgLight", "jawgDark");

  const GpxLayerGroupRef = useRef();
  const GpxLayerRef = useRef();

  useEffect(() => {
    if (activeMarker) {
      const marker = markerRefObj[activeMarker];
      if (marker) {
        marker.openTooltip();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMarker]);

  useEffect(() => {
    if (dataList?.length) {
      const newMarkersObj = {};
      const newMarkerRefObj = {};
      dataList.forEach((data, index) => {
        const isPPatch = data.slug.indexOf("p-patch") === 0;
        if (data.lat && data.long) {
          newMarkersObj[data.slug] = (
            <Marker
              key={index}
              position={[data.lat, data.long]}
              icon={isPPatch ? markerIcon_pPatch : markerIcon}
              eventHandlers={{
                click: (e) => {
                  setActiveCarouselItem(0);
                  loadData(data.slug);
                },
              }}
              ref={(markerRef) => (newMarkerRefObj[data.slug] = markerRef)}
            >
              <Tooltip sticky>
                {data.parkName?.length > 20
                  ? `${data.parkName.substring(0, 20)}...`
                  : data.parkName}
              </Tooltip>
            </Marker>
          );
        }
      });
      setMarkersObj(newMarkersObj);
      setMarkerRefObj(newMarkerRefObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataList]);

  useEffect(() => {
    if (!mapState) return;
    if (mapState.hasLayer(currentTiles)) {
      currentTiles.remove();
    }
    let tileProvider = colorMode === "light" ? "jawgLight" : "jawgDark";
    let tmp = L.tileLayer(osm[tileProvider].url, {
      attribution: osm[tileProvider].attribution,
    });
    mapState.addLayer(tmp);
    setCurrentTiles(tmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

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

  const markerIcon = new L.Icon({
    iconUrl: "/tree-t.png",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });

  const markerIcon_pPatch = new L.Icon({
    iconUrl: "/plant.png",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });

  // <a href="https://www.flaticon.com/free-icons/christmas-tree" title="christmas tree icons">Christmas tree icons created by Pixel perfect - Flaticon</a>

  function MapEventListener() {
    const map = useMapEvents({
      zoomend: () => {
        const bounds = map.getBounds();
        getParksInBounds({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      },
      moveend: () => {
        const bounds = map.getBounds();
        getParksInBounds({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      },
    });
    return null;
  }

  const interactionOptions = {
    zoomControl: true,
    doubleClickZoom: true,
    closePopupOnClick: true,
    dragging: true,
    zoomSnap: false,
    zoomDelta: true,
    trackResize: true,
    touchZoom: true,
    scrollWheelZoom: true,
  };

  const mapBgColor = useColorModeValue("white", "#191a1a");

  return (
    <MapContainer
      className={styles.map}
      style={{ backgroundColor: mapBgColor }}
      center={routeData.initCenter}
      attributionControl={false}
      ref={setMapState}
      fullscreenControl={true}
      {...interactionOptions}
    >
      <MapEventListener />
      <TileLayer
        url={osm[tileProvider].url}
        attribution={osm[tileProvider].attribution}
        ref={setCurrentTiles}
      />
      <LayerGroup ref={GpxLayerGroupRef}>
        <GpxLayer routeData={routeData} ref={GpxLayerRef} />
      </LayerGroup>
      <LayerGroup>{Object.values(markersObj)}</LayerGroup>
    </MapContainer>
  );
};

export default LeafletFull;
