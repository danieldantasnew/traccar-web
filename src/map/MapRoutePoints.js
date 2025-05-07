import { useId, useCallback, useEffect, useState } from "react";
import { map } from "./core/MapView";
import getSpeedColor from "../common/util/colors";
import { findFonts } from "./core/mapUtil";
import { SpeedLegendControl } from "./legend/MapSpeedLegend";
import { useTranslation } from "../common/components/LocalizationProvider";
import { useAttributePreference } from "../common/util/preferences";
import { useSelector } from "react-redux";

const distanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Raio da Terra em metros.
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const averageAngle = (angle1, angle2) => {
  const diff = (angle2 - angle1 + 360) % 360;
  const adjustedDiff = diff > 180 ? diff - 360 : diff;
  return (angle1 + adjustedDiff / 2 + 360) % 360;
};

const createGhostPositions = (positions, spacing = 50) => {
  if (!positions || positions.length === 0) return positions;
  const ghostPositions = [];

  for (let i = 0; i < positions.length - 1; i++) {
    const start = positions[i];
    const end = positions[i + 1];

    ghostPositions.push(start);

    const d = distanceBetweenPoints(
      start.latitude,
      start.longitude,
      end.latitude,
      end.longitude
    );

    if (d > spacing) {
      const numGhosts = Math.floor(d / spacing);
      for (let j = 1; j < numGhosts; j++) {
        const fraction = (j * spacing) / d;
        const ghostLat = start.latitude + fraction * (end.latitude - start.latitude);
        const ghostLon = start.longitude + fraction * (end.longitude - start.longitude);
        const ghostCourse = averageAngle(start.course, end.course);
        const ghostSpeed = start.speed + fraction * (end.speed - start.speed);

        const ghostPoint = {
          id: `ghost_${start.id}_${end.id}_${(j * spacing).toFixed(0)}`,
          latitude: ghostLat,
          longitude: ghostLon,
          speed: ghostSpeed,
          course: ghostCourse,
          isGhost: true,
        };

        ghostPositions.push(ghostPoint);
      }
    }
  }

  ghostPositions.push(positions[positions.length - 1]);
  return ghostPositions;
};

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
        "text-size": 26,
        "text-allow-overlap": true,
        "text-rotate": ["get", "rotation"],
        "text-offset": [.1, 0] 
      },
    });

    map.on("mouseenter", id, onMouseEnter);
    map.on("mouseleave", id, onMouseLeave);
    map.on("click", id, onMarkerClick);
    map.on("zoom", updateZoomLevel);

    map.once("styledata", () => {
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
  }, [onMarkerClick, id]);

  useEffect(() => {
    if (!map.getSource(id)) return;

    const processedPositions = createGhostPositions(positions, 50);
    const finalPositions = needFilterPosition
      ? processedPositions.filter((_, index) =>
          index % (zoomLevel < 13 ? 40 : zoomLevel >= 13 && zoomLevel < 16 ? 24 : 20) === 0
        )
      : processedPositions;

    const maxSpeed = positions.reduce((a, b) => Math.max(a, b.speed), -Infinity);
    const minSpeed = positions.reduce((a, b) => Math.min(a, b.speed), Infinity);

    const data = {
      type: "FeatureCollection",
      features: finalPositions.map((position, index) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [position.longitude, position.latitude],
        },
        properties: {
          index,
          id: position.id,
          rotation: position.course,
          color:
            colorStatic && devices[selectedId]
              ? devices[selectedId].attributes["web.reportColor"].split(";")[0]
              : getSpeedColor(position.speed, minSpeed, maxSpeed),
          isGhost: position.isGhost || false,
        },
      })),
    };

    map.getSource(id)?.setData(data);
  }, [
    positions,
    zoomLevel,
    speedRoutes,
    colorStatic,
    needFilterPosition,
    devices,
    selectedId,
    id,
  ]);

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