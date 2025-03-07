// import { useId, useCallback, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useMediaQuery } from '@mui/material';
// import { useTheme } from '@mui/styles';
// import { map } from './core/MapView';
// import { formatTime, getStatusColor } from '../common/util/formatter';
// import { mapIconKey } from './core/preloadImages';
// import { useAttributePreference } from '../common/util/preferences';
// import { useCatchCallback } from '../reactHelper';
// import { findFonts } from './core/mapUtil';

// const MapPositions = ({ positions, onClick, showStatus, selectedPosition, titleField }) => {
//   const id = useId();
//   const clusters = `${id}-clusters`;
//   const selected = `${id}-selected`;

//   const theme = useTheme();
//   const desktop = useMediaQuery(theme.breakpoints.up('md'));
//   const iconScale = useAttributePreference('iconScale', desktop ? 1 : 1.6);

//   const devices = useSelector((state) => state.devices.items);
//   const selectedDeviceId = useSelector((state) => state.devices.selectedId);

//   const mapCluster = useAttributePreference('mapCluster', true);
//   const directionType = useAttributePreference('mapDirection', 'selected');

//   const createFeature = (devices, position, selectedPositionId) => {

//     const device = devices[position.deviceId];
//     let showDirection;
//     switch (directionType) {
//       case 'none':
//         showDirection = false;
//         break;
//       case 'all':
//         showDirection = position.course > 0;
//         break;
//       default:
//         showDirection = selectedPositionId === position.id && position.course > 0;
//         break;
//     }
//     return {
//       id: position.id,
//       deviceId: position.deviceId,
//       name: device.name,
//       fixTime: formatTime(position.fixTime, 'seconds'),
//       category: mapIconKey(device.category),
//       color: showStatus ? position.attributes.color || getStatusColor(device.status) : 'neutral',
//       rotation: position.course,
//       direction: showDirection,
//     };
//   };

//   const onMouseEnter = () => map.getCanvas().style.cursor = 'pointer';
//   const onMouseLeave = () => map.getCanvas().style.cursor = '';

//   const onMapClick = useCallback((event) => {
//     if (!event.defaultPrevented && onClick) {
//       onClick(event.lngLat.lat, event.lngLat.lng);
//     }
//   }, [onClick]);

//   const onMarkerClick = useCallback((event) => {
//     event.preventDefault();
//     const feature = event.features[0];
//     if (onClick) {
//       onClick(feature.properties.id, feature.properties.deviceId);
//     }
//   }, [onClick]);

//   const onClusterClick = useCatchCallback(async (event) => {
//     event.preventDefault();
//     const features = map.queryRenderedFeatures(event.point, {
//       layers: [clusters],
//     });
//     const clusterId = features[0].properties.cluster_id;
//     const zoom = await map.getSource(id).getClusterExpansionZoom(clusterId);
//     map.easeTo({
//       center: features[0].geometry.coordinates,
//       zoom,
//     });
//   }, [clusters]);

//   useEffect(() => {
//     map.addSource(id, {
//       type: 'geojson',
//       data: {
//         type: 'FeatureCollection',
//         features: [],
//       },
//       cluster: mapCluster,
//       clusterMaxZoom: 14,
//       clusterRadius: 50,
//     });
//     map.addSource(selected, {
//       type: 'geojson',
//       data: {
//         type: 'FeatureCollection',
//         features: [],
//       },
//     });
//     [id, selected].forEach((source) => {
//       map.addLayer({
//         id: source,
//         type: 'symbol',
//         source,
//         filter: ['!has', 'point_count'],
//         layout: {
//           'icon-image': '{category}-{color}',
//           'icon-size': iconScale,
//           'icon-allow-overlap': true,
//           'text-field': `{${titleField || 'name'}}`,
//           'text-allow-overlap': true,
//           'text-anchor': 'bottom',
//           'text-offset': [0, -2 * iconScale],
//           'text-font': findFonts(map),
//           'text-size': 14,
//         },
//         paint: {
//           'text-halo-color': 'green',
//           'text-color': 'green',
//           'text-halo-width': .3,
//         },
//       });

//       map.addLayer({
//         id: `direction-${source}`,
//         type: 'symbol',
//         source,
//         filter: [
//           'all',
//           ['!has', 'point_count'],
//           ['==', 'direction', true],
//         ],
//         layout: {
//           'icon-image': 'direction',
//           'icon-size': iconScale * 1.06,
//           'icon-allow-overlap': true,
//           'icon-rotate': ['get', 'rotation'],
//           'icon-rotation-alignment': 'map',
//         },
//       });

//       map.on('mouseenter', source, onMouseEnter);
//       map.on('mouseleave', source, onMouseLeave);
//       map.on('click', source, onMarkerClick);
//     });
//     map.addLayer({
//       id: clusters,
//       type: "circle",
//       source: id,
//       filter: ["has", "point_count"],
//       paint: {
//         "circle-color": "rgb(0, 45, 143)",
//         "circle-radius": 16,
//         "circle-stroke-width": 3,
//         "circle-stroke-color": "rgb(25, 90, 231)"
//       }
//     });

//     map.addLayer({
//       id: `${clusters}-label`,
//       type: "symbol",
//       source: id,
//       filter: ["has", "point_count"],
//       layout: {
//         "text-field": "{point_count_abbreviated}",
//         "text-font": findFonts(map),
//         "text-size": 16,
//       },
//       paint: {
//         "text-color": "rgb(255, 255, 255)",
//       }
//     });
    
//     map.on('mouseenter', clusters, onMouseEnter);
//     map.on('mouseleave', clusters, onMouseLeave);
//     map.on('click', clusters, onClusterClick);
//     map.on('click', onMapClick);

//     return () => {
//       map.off('mouseenter', clusters, onMouseEnter);
//       map.off('mouseleave', clusters, onMouseLeave);
//       map.off('click', clusters, onClusterClick);
//       map.off('click', onMapClick);

//       if (map.getLayer(clusters)) {
//         map.removeLayer(clusters);
//       }

//       [id, selected].forEach((source) => {
//         map.off('mouseenter', source, onMouseEnter);
//         map.off('mouseleave', source, onMouseLeave);
//         map.off('click', source, onMarkerClick);

//         if (map.getLayer(source)) {
//           map.removeLayer(source);
//         }
//         if (map.getLayer(`direction-${source}`)) {
//           map.removeLayer(`direction-${source}`);
//         }
//         if (map.getSource(source)) {
//           map.removeSource(source);
//         }
//       });
//     };
//   }, [mapCluster, clusters, onMarkerClick, onClusterClick]);

//   useEffect(() => {
//     [id, selected].forEach((source) => {
//       map.getSource(source)?.setData({
//         type: 'FeatureCollection',
//         features: positions.filter((it) => devices.hasOwnProperty(it.deviceId))
//           .filter((it) => (source === id ? it.deviceId !== selectedDeviceId : it.deviceId === selectedDeviceId))
//           .map((position) => ({
//             type: 'Feature',
//             geometry: {
//               type: 'Point',
//               coordinates: [position.longitude, position.latitude],
//             },
//             properties: createFeature(devices, position, selectedPosition && selectedPosition.id),
//           })),
//       });

//       if (map.getLayer(source)) map.moveLayer(source);
//     });
//   }, [mapCluster, clusters, onMarkerClick, onClusterClick, devices, positions, selectedPosition]);

//   return null;
// };

// export default MapPositions;




import { useId, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { map } from "./core/MapView";
import { formatTime, getStatusColor } from "../common/util/formatter";
import { mapIconKey } from "./core/preloadImages";
import { useAttributePreference } from "../common/util/preferences";
import { useCatchCallback } from "../reactHelper";
import mapboxgl from "mapbox-gl";
import "./css/style.css";
import { DynamicIcons } from "./DynamicIcons";

const MapPositions = ({ positions, onClick, showStatus, selectedPosition }) => {
  const id = useId();
  const clusters = `${id}-clusters`;
  const selected = `${id}-selected`;
  const markersRef = useRef([]);

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const mapCluster = useAttributePreference("mapCluster", true);
  const directionType = useAttributePreference("mapDirection", "selected");

  const createFeature = (devices, position, selectedPositionId) => {
    const device = devices[position.deviceId];
    let showDirection;
    switch (directionType) {
      case "none":
        showDirection = false;
        break;
      case "all":
        showDirection = position.course > 0;
        break;
      default:
        showDirection =
          selectedPositionId === position.id && position.course > 0;
        break;
    }
    return {
      id: position.id,
      deviceId: position.deviceId,
      name: device.name,
      fixTime: formatTime(position.fixTime, "seconds"),
      category: mapIconKey(device.category),
      color: showStatus
        ? position.attributes.color || getStatusColor(device.status)
        : "neutral",
      rotation: position.course,
      direction: showDirection,
    };
  };

  const onMarkerClick = useCallback(
    (event) => {
      event.preventDefault();
      const feature = event.features[0];
      if (onClick) {
        onClick(feature.properties.id, feature.properties.deviceId);
      }
    },
    [onClick]
  );

  const onClusterClick = useCatchCallback(
    async (event) => {
      event.preventDefault();
      const features = map.queryRenderedFeatures(event.point, {
        layers: [clusters],
      });
      const clusterId = features[0].properties.cluster_id;
      const zoom = await map.getSource(id).getClusterExpansionZoom(clusterId);
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom,
      });
    },
    [clusters]
  );

  useEffect(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!map || !positions.length) return;

    positions
      .filter((it) => devices.hasOwnProperty(it.deviceId))
      .forEach((position) => {
        const el = document.createElement("div");
        const device = devices[position.deviceId];

        el.className = "marker";
        el.style.backgroundColor = device.subColor;
        el.style.color = device.color;
        el.innerHTML = `
          <div>
            ${DynamicIcons(device.category)}
          </div>
          <div>
            <p>${devices[position.deviceId].model}</p>
            <p>${devices[position.deviceId].name}</p>
          </div>
        `;

        el.addEventListener("click", (event) => {
          event.stopPropagation();
          onClick(position.id, position.deviceId);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([position.longitude, position.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [map, positions, devices]);

  useEffect(() => {
    [id, selected].forEach((source) => {
      map.getSource(source)?.setData({
        type: "FeatureCollection",
        features: positions
          .filter((it) => devices.hasOwnProperty(it.deviceId))
          .filter((it) =>
            source === id
              ? it.deviceId !== selectedDeviceId
              : it.deviceId === selectedDeviceId
          )
          .map((position) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [position.longitude, position.latitude],
            },
            properties: createFeature(
              devices,
              position,
              selectedPosition && selectedPosition.id
            ),
          })),
      });
    });
  }, [
    mapCluster,
    clusters,
    onMarkerClick,
    onClusterClick,
    devices,
    positions,
    selectedPosition,
  ]);

  return null;
};

export default MapPositions;
