import { useColorModeValue, useColorMode, Text, Box } from "@chakra-ui/react";
import { useEffect, useState, useRef, forwardRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./LeafletFull.module.css";
import osm from "../../data/scripts/osm-providers";
import "leaflet.heat";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
  useMap,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line react/display-name
const HeatmapLayer = forwardRef(({ heatmapData }, ref) => {
  const map = useMap();
  useEffect(() => {
    const layer = L.heatLayer(heatmapData, {
      radius: 20,
      gradient: { 0: "#87CEEB", 1: "#87CEEB" },
    });
    if (map.hasLayer(layer)) return;
    layer.addTo(map);
    ref.current = layer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
});

const LeafletFull = ({
  dataList,
  initCenter,
  initZoom,
  loadData,
  getParksInBounds,
  activeCarouselItem,
  setActiveCarouselItem,
  activeMarker,
  heatmapData,
}) => {
  const { colorMode } = useColorMode();
  const [mapState, setMapState] = useState(null);
  const [currentTiles, setCurrentTiles] = useState(null);
  const [markersObj, setMarkersObj] = useState({});
  const [markerRefObj, setMarkerRefObj] = useState({});
  const [mapBgColor, setMapBgColor] = useState(useColorModeValue("white", "#191a1a"))

  let tileProvider = useColorModeValue("jawgLight", "jawgDark");

  const heatmapLayerGroupRef = useRef();
  const heatmapLayerRef = useRef();

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
    setMapBgColor(colorMode === "light" ? "white" : "#191a1a")
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
      //TODO
      layeradd: (e) => {
        // console.log('layeradd', e.layer, map);
        if (
          map &&
          heatmapLayerRef.current &&
          e.layer?._leaflet_id === heatmapLayerGroupRef?.current?._leaflet_id
        ) {
          if (map.hasLayer(heatmapLayerRef.current)) return;
          map.addLayer(heatmapLayerRef.current);
        }
      },
      layerremove: (e) => {
        console.log('layerremove', e.layer)
        if (
          map &&
          heatmapLayerRef.current &&
          e.layer?._leaflet_id === heatmapLayerGroupRef?.current?._leaflet_id
        ) {
          if (!map.hasLayer(heatmapLayerRef.current)) return;
          map.removeLayer(heatmapLayerRef.current);
        }
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

  return (
    <Box textAlign={'center'} p={7}
      bgGradient={useColorModeValue("linear(to-b, gray.100, transparent)", "linear(to-b, blackAlpha.300, transparent)")}
    >
      <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '10px' }}>Parks Map</h2>
      <Text mb={2}>scroll and zoom to discover parks</Text>
      <MapContainer
        className={styles.map}
        style={{ backgroundColor: mapBgColor }}
        center={initCenter}
        zoom={initZoom}
        attributionControl={false}
        ref={setMapState}
        fullscreenControl={true}
        {...interactionOptions}
      >
        <MapEventListener />
        <LayersControl position="topright">
          <TileLayer
            url={osm[tileProvider].url}
            attribution={osm[tileProvider].attribution}
            ref={setCurrentTiles}
          />
          <LayersControl.Overlay name="Heatmap" checked>
            <LayerGroup ref={heatmapLayerGroupRef}>
              <HeatmapLayer heatmapData={heatmapData} ref={heatmapLayerRef} />
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Parks Visited" checked>
            <LayerGroup>{Object.values(markersObj)}</LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </Box>
  );
};

export default LeafletFull;
