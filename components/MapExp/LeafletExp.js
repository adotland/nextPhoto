import { useColorModeValue, useColorMode } from '@chakra-ui/react';
import { useEffect, useState, useRef, forwardRef } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LeafletExp.module.css';
import osm from "../../cms/data/live/scripts/osm-providers";
import "leaflet.heat"
import 'leaflet.fullscreen/Control.FullScreen.js'
import 'leaflet.fullscreen/Control.FullScreen.css'

import { MapContainer, TileLayer, Tooltip, useMapEvents, useMap, LayersControl, LayerGroup, GeoJSON, Marker, FeatureGroup, ScaleControl } from 'react-leaflet';

const markerIcon = new L.Icon({
  iconUrl: '/tree-t.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
})

// const HeatmapLayer = forwardRef(({ heatmapData }, ref) => {
//   const map = useMap()
//   useEffect(() => {
//     const layer = L.heatLayer(heatmapData, { radius: 40, gradient: {0.1: 'blue', 0.3: 'lime', 0.5: 'red'} });
//     if (map.hasLayer(layer)) return
//     layer.addTo(map);
//     ref.current = layer;
//   }, []);
// })

const ParkMarkerLayer = ({ dataList }) => {
  return dataList.map((data, index) => {
    if (data.lat && data.long) {
      return (
        <Marker
          key={index}
          position={[data.lat, data.long]}
          icon={markerIcon}
        // ref={(markerRef) => newMarkerRefObj[data.slug] = markerRef}
        >
          <Tooltip sticky>
            {data.parkName?.length > 20 ? `${data.parkName.substring(0, 20)}...` : data.parkName}
          </Tooltip>
        </Marker>)
    }
  })
}

const LeafletExp = ({ data_geo_race, data_geo_census, seattleParks, pPatchParks }) => {
  const { colorMode } = useColorMode()
  const [mapState, setMapState] = useState(null);
  const [currentTiles, setCurrentTiles] = useState(null);
  const outlineColor = useColorModeValue('black', 'white');

  let tileProvider = useColorModeValue('jawgLight', 'jawgDark');

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
  }

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
  }

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
  }

  const getColor = (num, pallete, invert = false) => {
    num = invert ? 1 - num : num;
    const scaled = Math.round(num * 10)
    return pallete[scaled]
  }

  const style = {
    poc: (feature) => {
      const {
        properties: { PTL_PEOPLE_OF_COLOR }
      } = feature
      return {
        fillColor: getColor(PTL_PEOPLE_OF_COLOR, skinTonePallete),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5
      }
    },
    health: (feature) => {
      const {
        properties: { HEALTH_PERCENTILE }
      } = feature
      return {
        fillColor: getColor(HEALTH_PERCENTILE, blueRedPallete, true),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5
      }
    },
    foreign: (feature) => {
      const {
        properties: { PTL_FOREIGN_BORN }
      } = feature
      return {
        fillColor: getColor(PTL_FOREIGN_BORN, blueRedPallete, true),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5
      }
    },
    obese: (feature) => {
      const {
        properties: { PTL_ADULT_OBESE }
      } = feature
      return {
        fillColor: getColor(PTL_ADULT_OBESE, blueRedPallete, true),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5
      }
    },
    black: (feature) => {
      const {
        properties: { F2020_PL_data_BLACK_NOT_HISPANI, F2020_PL_data_TOT_POP }
      } = feature
      return {
        fillColor: getColor(F2020_PL_data_BLACK_NOT_HISPANI / F2020_PL_data_TOT_POP, skinTonePallete),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5
      }
    },
    black90: (feature) => {
      const {
        properties: { F1990_PL_data_BLACK_NOT, F1990_PL_data_TOT_POP }
      } = feature
      return {
        fillColor: getColor(F1990_PL_data_BLACK_NOT / F1990_PL_data_TOT_POP, skinTonePallete),
        weight: 0.3,
        opacity: 1,
        color: outlineColor,
        dashArray: "3",
        fillOpacity: 0.5
      }
    }
  }

  function onEachArea_black(feature, layer) {
    if (feature.properties) {
      const {
        properties: { F2020_PL_data_BLACK_NOT_HISPANI, F2020_PL_data_TOT_POP }
      } = feature
      const pct = parseInt((F2020_PL_data_BLACK_NOT_HISPANI / F2020_PL_data_TOT_POP) * 100).toString()
      layer.bindTooltip(pct, { permanent: true, opacity: 0.7 }).openTooltip()
    }
  }

  function onEachArea_black90(feature, layer) {
    if (feature.properties) {
      const {
        properties: { F1990_PL_data_BLACK_NOT, F1990_PL_data_TOT_POP }
      } = feature
      const pct = parseInt((F1990_PL_data_BLACK_NOT / F1990_PL_data_TOT_POP) * 100).toString()
      layer.bindTooltip(pct, { permanent: true, opacity: 0.7 }).openTooltip()
    }
  }

  // const heatmapLayerGroupRef = useRef();
  // const heatmapLayerRef = useRef();

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

  const center = [47.6092355, -122.317784] // seattle univ

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
    <MapContainer
      className={styles.map}
      center={center}
      zoom={12}
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
        {/* <LayersControl.Overlay name="Heatmap" checked>
          <LayerGroup ref={heatmapLayerGroupRef} >
            <HeatmapLayer heatmapData={heatmapData} ref={heatmapLayerRef} />
          </LayerGroup>
        </LayersControl.Overlay> */}
        <LayersControl.Overlay name="Obesity">
          <FeatureGroup >
            <GeoJSON data={data_geo_race} style={style.obese} />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Health">
          <FeatureGroup >
            <GeoJSON data={data_geo_race} style={style.health} />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Foreign Born">
          <FeatureGroup >
            <GeoJSON data={data_geo_race} style={style.foreign} />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Racial Diversity">
          <FeatureGroup >
            <GeoJSON data={data_geo_race} style={style.poc} />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Black Population" checked>
          <FeatureGroup >
            <GeoJSON data={data_geo_census} style={style.black} onEachFeature={onEachArea_black} />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="1990 Black Population">
          <FeatureGroup >
            <GeoJSON data={data_geo_census} style={style.black90} onEachFeature={onEachArea_black90} />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Seattle Parks">
          <LayerGroup>
            <ParkMarkerLayer dataList={seattleParks} />
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="P-Patches">
          <LayerGroup>
            <ParkMarkerLayer dataList={pPatchParks} />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <ScaleControl position={"bottomleft"} />

    </MapContainer>
  )
}

export default LeafletExp;
