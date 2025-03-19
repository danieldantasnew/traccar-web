import { useId, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { map } from "./core/MapView.jsx";
import { formatTime, getStatusColor } from "../common/util/formatter.js";
import { mapIconKey } from "./core/preloadImages.js";
import { useAttributePreference } from "../common/util/preferences.js";
import { useCatchCallback } from "../reactHelper.js";
import mapboxgl from "mapbox-gl";
import "./css/style.css";
import { DynamicIconsComponent } from "../common/components/DynamicIcons.jsx";
import { Tooltip } from "@mui/material";
import { createRoot } from 'react-dom/client';

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
    if (!map || !positions.length) return;
  
    const newPositionMap = new Map(positions.map(p => [p.id, p]));
  
    markersRef.current = markersRef.current.filter(({ marker, root, positionId }) => {
      const newPosition = newPositionMap.get(positionId);
      
      if (!newPosition) {
        setTimeout(() => {
          root.unmount();
          marker.remove();
        }, 0);
        return false;
      } else {
        const { longitude, latitude } = newPosition;
        const currentLngLat = marker.getLngLat();
        if (currentLngLat.lng !== longitude || currentLngLat.lat !== latitude) {
          marker.setLngLat([longitude, latitude]);
        }
        return true;
      }
    });
  
    positions.forEach((position) => {
      if (markersRef.current.some((m) => m.positionId === position.id)) return;
  
      const el = document.createElement("div");
      const device = devices[position.deviceId];
      const colors = device.attributes['web.reportColor']? device.attributes['web.reportColor'].split(';') : ["rgb(189, 12, 18)", "white", "rgb(255, 0, 8)"];
  
      el.className = "marker";
  
      const root = createRoot(el);
      root.render(
        <Tooltip title={device ? `Última atualização: ${formatTime(device.lastUpdate)}` : ""} followCursor arrow>
          <div style={{ display: "flex", gap: ".8rem", alignItems: "center", justifyContent: "space-between", padding: "2px" }}>
            <DynamicIconsComponent key={device.name} category={device.category} />
            <div>
              <p>{device.model}</p>
              <p>{device.name}</p>
            </div>
          </div>
        </Tooltip>
      );
  
      el.style.backgroundColor = colors[0];
      el.style.color = colors[1];
  
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        onClick(position.id, position.deviceId);
      });
  
      const marker = new mapboxgl.Marker(el)
        .setLngLat([position.longitude, position.latitude])
        .addTo(map);
  
      markersRef.current.push({ marker, root, positionId: position.id });
    });
  
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
