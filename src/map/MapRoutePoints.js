import { useId, useCallback, useEffect, useState } from "react";
import { map } from "./core/MapView";
import getSpeedColor from "../common/util/colors";
import { findFonts } from "./core/mapUtil";
import { SpeedLegendControl } from "./legend/MapSpeedLegend";
import { useTranslation } from "../common/components/LocalizationProvider";
import { useAttributePreference } from "../common/util/preferences";
import { useSelector } from "react-redux";

const MapRoutePoints = ({
  positions,
  onClick,
  colorStatic,
  needFilterPosition,
  speedRoutes,
}) => {
  const id = useId();
  const t = useTranslation();
  const speedUnit = useAttributePreference("speedUnit");
  const devices = useSelector((state) => state.devices.items);
  const selectedId = useSelector((state) => state.devices.selectedId);
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  const onMouseEnter = () => (map.getCanvas().style.cursor = "pointer");
  const onMouseLeave = () => (map.getCanvas().style.cursor = "");

  const onMarkerClick = useCallback(
    (event) => {
      event.preventDefault();
      const feature = event.features[0];
      if (onClick) {
        onClick(feature.properties.id, feature.properties.index);
      }
    },
    [onClick]
  );

  useEffect(() => {
    const updateZoomLevel = () => setZoomLevel(map.getZoom());

    map.addSource(id, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    map.addLayer({
      id,
      type: "symbol",
      source: id,
      paint: { "text-color": ["get", "color"] },
      layout: {
        "text-font": findFonts(map),
        "text-field": "▲",
        "text-size": 22,
        "text-allow-overlap": true,
        "text-rotate": ["get", "rotation"],
      },
    });

    map.on("mouseenter", id, onMouseEnter);
    map.on("mouseleave", id, onMouseLeave);
    map.on("click", id, onMarkerClick);
    map.on("zoom", updateZoomLevel);

    map.once('styledata', () => {
      if (map.getLayer(id)) {
        map.moveLayer(id);
      }
    });

    return () => {
      map.off("mouseenter", id, onMouseEnter);
      map.off("mouseleave", id, onMouseLeave);
      map.off("click", id, onMarkerClick);
      map.off("zoom", updateZoomLevel);

      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, [onMarkerClick]);

  useEffect(() => {
    if (!map.getSource(id)) return;
  
    const maxSpeed = positions.reduce((a, b) => Math.max(a, b.speed), -Infinity);
    const minSpeed = positions.reduce((a, b) => Math.min(a, b.speed), Infinity);
  
    const filterFactor = zoomLevel < 15 ? 16 : zoomLevel > 15 && zoomLevel < 16 ? 8 : 4;
    const filteredPositions = positions.filter((_, index) => index % filterFactor === 0);
  
    const data = {
      type: "FeatureCollection",
      features: (needFilterPosition ? filteredPositions : positions).map((position, index) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [position.longitude, position.latitude] },
        properties: {
          index,
          id: position.id,
          rotation: position.course,
          color:
            colorStatic && devices[selectedId]
              ? devices[selectedId].attributes["web.reportColor"].split(";")[0]
              : getSpeedColor(position.speed, minSpeed, maxSpeed),
        },
      })),
    };
  
    map.getSource(id)?.setData(data);
  }, [positions, zoomLevel, speedRoutes, colorStatic, needFilterPosition, devices, selectedId]);

  useEffect(() => {
    const maxSpeed = positions.reduce((a, b) => Math.max(a, b.speed), -Infinity);
    const minSpeed = positions.reduce((a, b) => Math.min(a, b.speed), Infinity);
  
    const control = new SpeedLegendControl(positions, speedUnit, t, maxSpeed, minSpeed);
    map.addControl(control, "bottom-left");
  
    return () => map.removeControl(control);
  }, [positions, speedUnit, t, speedRoutes]);
  

  return null;
};

export default MapRoutePoints;


// import { useId, useCallback, useEffect, useState } from "react";
// import { map } from "./core/MapView";
// import getSpeedColor from "../common/util/colors";
// import { findFonts } from "./core/mapUtil";
// import { SpeedLegendControl } from "./legend/MapSpeedLegend";
// import { useTranslation } from "../common/components/LocalizationProvider";
// import { useAttributePreference } from "../common/util/preferences";
// import { useSelector } from "react-redux";

// const haversineDistance = (coord1, coord2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371000;
//   const dLat = toRad(coord2.latitude - coord1.latitude);
//   const dLon = toRad(coord2.longitude - coord1.longitude);
//   const lat1 = toRad(coord1.latitude);
//   const lat2 = toRad(coord2.latitude);

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// const interpolatePoint = (start, end, distance) => {
//   const totalDistance = haversineDistance(start, end);
//   const fraction = distance / totalDistance;
//   return {
//     latitude: start.latitude + (end.latitude - start.latitude) * fraction,
//     longitude: start.longitude + (end.longitude - start.longitude) * fraction,
//     course: start.course,
//     speed: start.speed,
//     id: `${start.id}-ghost`,
//   };
// };

// const processPositions = (positions, minDistance = 50) => {
//   const filteredPositions = [];
//   for (let i = 0; i < positions.length - 1; i++) {
//     const current = positions[i];
//     const next = positions[i + 1];
//     filteredPositions.push(current);

//     let distance = haversineDistance(current, next);
//     while (distance > minDistance) {
//       const ghostPoint = interpolatePoint(current, next, minDistance);
//       filteredPositions.push(ghostPoint);
//       distance -= minDistance;
//     }
//   }
//   filteredPositions.push(positions[positions.length - 1]);
//   return filteredPositions;
// };

// const MapRoutePoints = ({ positions, onClick, colorStatic }) => {
//   const id = useId();
//   const t = useTranslation();
//   const speedUnit = useAttributePreference("speedUnit");
//   const devices = useSelector((state) => state.devices.items);
//   const selectedId = useSelector((state) => state.devices.selectedId);
//   const [zoomLevel, setZoomLevel] = useState(map.getZoom());

//   const onMouseEnter = () => (map.getCanvas().style.cursor = "pointer");
//   const onMouseLeave = () => (map.getCanvas().style.cursor = "");

//   const onMarkerClick = useCallback(
//     (event) => {
//       event.preventDefault();
//       const feature = event.features[0];
//       if (onClick) {
//         onClick(feature.properties.id, feature.properties.index);
//       }
//     },
//     [onClick]
//   );

//   useEffect(() => {
//     const updateZoomLevel = () => setZoomLevel(map.getZoom());

//     map.addSource(id, {
//       type: "geojson",
//       data: { type: "FeatureCollection", features: [] },
//     });

//     map.addLayer({
//       id,
//       type: "symbol",
//       source: id,
//       paint: { "text-color": ["get", "color"] },
//       layout: {
//         "text-font": findFonts(map),
//         "text-field": "▲",
//         "text-size": 22,
//         "text-allow-overlap": true,
//         "text-rotate": ["get", "rotation"],
//       },
//     });

//     map.on("mouseenter", id, onMouseEnter);
//     map.on("mouseleave", id, onMouseLeave);
//     map.on("click", id, onMarkerClick);
//     map.on("zoom", updateZoomLevel);

//     setTimeout(() => {
//       map.moveLayer(id);
//     }, 100);

//     return () => {
//       map.off("mouseenter", id, onMouseEnter);
//       map.off("mouseleave", id, onMouseLeave);
//       map.off("click", id, onMarkerClick);
//       map.off("zoom", updateZoomLevel);

//       if (map.getLayer(id)) {
//         map.removeLayer(id);
//       }
//       if (map.getSource(id)) {
//         map.removeSource(id);
//       }
//     };
//   }, [onMarkerClick]);

//   useEffect(() => {
//     const maxSpeed = positions.reduce(
//       (a, b) => Math.max(a, b.speed),
//       -Infinity
//     );
//     const minSpeed = positions.reduce((a, b) => Math.min(a, b.speed), Infinity);
  
//     const processedPositions = processPositions(positions);
//     const control = new SpeedLegendControl(
//       positions,
//       speedUnit,
//       t,
//       maxSpeed,
//       minSpeed
//     );
//     map.addControl(control, "bottom-left");

//     console.log(zoomLevel)
  
//     const filteredPositions = processedPositions
//     .filter((position) => position && position.longitude && position.latitude) // Filtra posições inválidas
//     .filter((_, index) => {
//       if (zoomLevel >= 16) {
//         return true; // Mostra todos os pontos
//       } else {
//         const reductionFactor = Math.ceil(Math.sqrt(16 - zoomLevel) * 4); // Redução moderada
//         return index % reductionFactor === 0; // Mantém apenas alguns pontos
//       }
//     });
  
//     map.getSource(id)?.setData({
//       type: "FeatureCollection",
//       features: filteredPositions
//         .map((position, index) => ({
//           type: "Feature",
//           geometry: {
//             type: "Point",
//             coordinates: [position.longitude, position.latitude],
//           },
//           properties: {
//             index,
//             id: position.id,
//             rotation: position.course,
//             color:
//               colorStatic && devices[selectedId]
//                 ? devices[selectedId].attributes["web.reportColor"].split(";")[0]
//                 : getSpeedColor(position.speed, minSpeed, maxSpeed),
//           },
//         })),
//     });
  
//     return () => map.removeControl(control);
//   }, [onMarkerClick, positions, zoomLevel]);
  

//   return null;
// };

// export default MapRoutePoints;
