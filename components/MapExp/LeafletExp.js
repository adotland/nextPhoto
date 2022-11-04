import { useColorModeValue, useColorMode, Flex } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./LeafletExp.module.css";
import osm from "../../data/scripts/osm-providers";
import "leaflet.heat";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";

import {
  MapContainer,
  TileLayer,
  Tooltip,
  useMapEvents,
  useMap,
  LayersControl,
  LayerGroup,
  GeoJSON,
  Marker,
  FeatureGroup,
  ScaleControl,
} from "react-leaflet";
import LeafletLegend from "../LeafletLegend";
import MapLayerButtons from "../MapLayerButtons";

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

// const HeatmapLayer = forwardRef(({ heatmapData }, ref) => {
//   const map = useMap()
//   useEffect(() => {
//     const layer = L.heatLayer(heatmapData, { radius: 40, gradient: {0.1: 'blue', 0.3: 'lime', 0.5: 'red'} });
//     if (map.hasLayer(layer)) return
//     layer.addTo(map);
//     ref.current = layer;
//   }, []);
// })

const ParkMarkerLayer = ({ dataList, isPPatch = false }) => {
  return dataList.map((data, index) => {
    if (data.lat && data.long) {
      return (
        <Marker
          key={index}
          position={[data.lat, data.long]}
          icon={isPPatch ? markerIcon_pPatch : markerIcon}
          // ref={(markerRef) => newMarkerRefObj[data.slug] = markerRef}
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
};

const LeafletExp = ({
  data_geo_demog,
  data_geo_park,
  seattleParks,
  pPatchParks,
}) => {
  const { colorMode } = useColorMode();
  const [mapState, setMapState] = useState(null);
  const [currentTiles, setCurrentTiles] = useState(null);
  const outlineColor = useColorModeValue("black", "white");

  let tileProvider = useColorModeValue("jawgLight", "jawgDark");

  const skinTonePallete = {
    10: "#2D221E",
    9: "#42352C",
    8: "#57473A",
    7: "#6C5A49",
    6: "#816C57",
    5: "#967F65",
    4: "#AB9173",
    3: "#C0A481",
    2: "#D5B690",
    1: "#EAC99E",
    0: "#FFDBAC",
  };

  const generalPallete = {
    10: "#00FF00",
    9: "#1AE600",
    8: "#33CC00",
    7: "#4DB300",
    6: "#669900",
    5: "#808000",
    4: "#996600",
    3: "#B34D00",
    2: "#CC3300",
    1: "#E61A00",
    0: "#FF0000",
  };


  const generalPallete_condensed = {
    10: "#00FF00",
    9: "#33CC00",
    8: "#33CC00",
    7: "#669900",
    6: "#669900",
    5: "#996600",
    4: "#B34D00",
    3: "#B34D00",
    2: "#E61A00",
    1: "#E61A00",
    0: "#FF0000",
  };

  const blueRedPallete = {
    10: "#0000FF",
    9: "#1A00E6",
    8: "#3300CC",
    7: "#4D00B3",
    6: "#660099",
    5: "#800080",
    4: "#990066",
    3: "#B3004D",
    2: "#CC0033",
    1: "#E6001A",
    0: "#FF0000",
  };

  const whiteBluePallete = {
    10: "#0000ff",
    9: "#4646FF",
    8: "#4646FF",
    7: "#7474FF",
    6: "#7474FF",
    5: "#A2A2FF",
    4: "#A2A2FF",
    3: "#D1D1FF",
    2: "#D1D1FF",
    1: "#fff",
    0: "#fff",
  };

  const getColor = (num, pallete, invert = false) => {
    num = invert ? 1 - num : num;
    const scaled = Math.round(num * 10);
    return pallete[scaled];
  };

  const getLegendColor = (num) => getColor(num, generalPallete, false);

  const style = {
    health: (feature) => {
      const {
        properties: { HEALTH_PERCENTILE },
      } = feature;
      return {
        fillColor: getColor(HEALTH_PERCENTILE, generalPallete_condensed, true),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5,
      };
    },
    // obese: (feature) => {
    //   const {
    //     properties: { PTL_ADULT_OBESE }
    //   } = feature
    //   return {
    //     fillColor: getColor(PTL_ADULT_OBESE, generalPallete_condensed, true),
    //     weight: 0.3,
    //     opacity: 1,
    //     color: outlineColor,
    //     dashArray: "3",
    //     fillOpacity: 0.5
    //   }
    // },
    econ: (feature) => {
      const {
        properties: { SOCIOECONOMIC_PERCENTILE },
      } = feature;
      return {
        fillColor: getColor(SOCIOECONOMIC_PERCENTILE, generalPallete_condensed, true),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5,
      };
    },
    mentalHealth: (feature) => {
      const {
        properties: { PTL_ADULTMENTALHEALTHNOTGOOD },
      } = feature;
      return {
        fillColor: getColor(PTL_ADULTMENTALHEALTHNOTGOOD, generalPallete_condensed, true),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5,
      };
    },
    activity: (feature) => {
      const {
        properties: { PTL_ADULTNOLEISUREPHYSACTIVITY },
      } = feature;
      return {
        fillColor: getColor(
          PTL_ADULTNOLEISUREPHYSACTIVITY,
          generalPallete_condensed,
          true
        ),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5,
      };
    },
    parkAreaPtl: (feature) => {
      const {
        properties: { parkAreaPtl },
      } = feature;
      return {
        fillColor: getColor(parkAreaPtl / 100, generalPallete_condensed, false),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5,
      };
    },
    parkAmountPtl: (feature) => {
      const {
        properties: { parkAmountPtl },
      } = feature;
      return {
        fillColor: getColor(parkAmountPtl / 100, generalPallete_condensed, false),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5,
      };
    },
  };
  function onEachArea_tractId(feature, layer) {
    if (feature.properties) {
      const {
        properties: { TRACT_20_LABEL },
      } = feature;
      layer
        .bindTooltip(TRACT_20_LABEL, { permanent: true, opacity: 0.7 })
        .openTooltip();
    }
  }
  function onEachArea_parkPtl(feature, layer) {
    if (feature.properties) {
      const {
        properties: { parkAreaPtl },
      } = feature;
      layer
        .bindTooltip(parkAreaPtl.toFixed(0), { permanent: true, opacity: 0.7 })
        .openTooltip();
    }
  }

  // const heatmapLayerGroupRef = useRef();
  // const heatmapLayerRef = useRef();

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

  const center = [47.6092355, -122.317784]; // seattle univ

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

  const displayMap = useMemo(
    () => (
      <MapContainer
        className={styles.map}
        center={center}
        zoom={11}
        attributionControl={false}
        ref={setMapState}
        fullscreenControl={true}
        {...interactionOptions}
      >
        {/* <MapEventListener /> */}
        <LayersControl position="topright">
          <TileLayer
            url={osm[tileProvider].url}
            attribution={osm[tileProvider].attribution}
            ref={setCurrentTiles}
          />
          <LayersControl.Overlay name="Overall Health">
            <FeatureGroup>
              <GeoJSON data={data_geo_demog} style={style.health} />
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Mental Health">
            <FeatureGroup>
              <GeoJSON data={data_geo_demog} style={style.mentalHealth} />
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Time For Exercise">
            <FeatureGroup>
              <GeoJSON data={data_geo_demog} style={style.activity} />
            </FeatureGroup>
          </LayersControl.Overlay>
          {/* <LayersControl.Overlay name="Obesity">
          <FeatureGroup >
            <GeoJSON data={data_geo_race} style={style.obese} />
          </FeatureGroup>
        </LayersControl.Overlay> */}
          <LayersControl.Overlay name="Financial Health">
            <FeatureGroup>
              <GeoJSON data={data_geo_demog} style={style.econ} />
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Park Area" checked>
            <LayerGroup>
              {/* <GeoJSON data={data_geo_park} style={style.parkAreaPtl} onEachFeature={onEachArea_parkPtl} /> */}
              <GeoJSON data={data_geo_park} style={style.parkAreaPtl} />
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Park Amount">
            <LayerGroup>
              {/* <GeoJSON data={data_geo_park} style={style.parkAreaPtl} onEachFeature={onEachArea_parkPtl} /> */}
              <GeoJSON data={data_geo_park} style={style.parkAmountPtl} />
            </LayerGroup>
          </LayersControl.Overlay>
          {/* <LayersControl.Overlay name="CensusTracts">
          <LayerGroup>
            <GeoJSON data={data_geo_census} onEachFeature={onEachArea_tractId} />
          </LayerGroup>
        </LayersControl.Overlay> */}
          <LayersControl.Overlay name="Seattle Parks">
            <LayerGroup>
              <ParkMarkerLayer dataList={seattleParks} />
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="P-Patches">
            <LayerGroup>
              <ParkMarkerLayer dataList={pPatchParks} isPPatch={true} />
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <ScaleControl position={"bottomleft"} />
        <LeafletLegend map={mapState} getColor={getLegendColor} />
      </MapContainer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <Flex
      m={[0, 0, 0, 0]}
      justifyContent={"space-evenly"}
      flexDir={["column", "column", "row"]}
      mt={[4, 4, 16, 4]}
    >
      {displayMap}
      {mapState ? <MapLayerButtons /> : null}
    </Flex>
  );
};

export default LeafletExp;
