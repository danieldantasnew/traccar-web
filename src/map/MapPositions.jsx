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
import ColorsDevice from "../common/components/ColorsDevice.js";

const MapPositions = ({ positions, onClick, showStatus, selectedPosition, setStatusCardOpen, setPositions, setStops }) => {
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
    const removedMarkers = [];
  
    // Criar um novo Map para armazenar os marcadores atualizados
    const newMarkersMap = new Map();
  
    markersRef.current.forEach(({ marker, root, positionId }) => {
      if (!newPositionMap.has(positionId)) {
        removedMarkers.push({ root, marker }); // Armazena para remover depois
      } else {
        // Atualiza a posição do marcador existente, se necessário
        const { longitude, latitude } = newPositionMap.get(positionId);
        const currentLngLat = marker.getLngLat();
        if (currentLngLat.lng !== longitude || currentLngLat.lat !== latitude) {
          marker.setLngLat([longitude, latitude]);
        }
        newMarkersMap.set(positionId, { marker, root, positionId });
      }
    });
  
    // Remove os marcadores antigos depois da renderização
    setTimeout(() => {
      removedMarkers.forEach(({ root, marker }) => {
        root.unmount();
        marker.remove();
      });
    }, 0);
  
    // Adicionar novos marcadores apenas se não existirem
    positions.forEach((position) => {
      if (newMarkersMap.has(position.id)) return;
  
      const el = document.createElement("div");
      const device = devices[position.deviceId] || {};
      const attributes = device.attributes || {};
      const { bgColor, color } = ColorsDevice(attributes["web.reportColor"] || "");
  
      el.className = "marker";
  
      const root = createRoot(el);
      root.render(
        <Tooltip title={device.lastUpdate ? `Última atualização: ${formatTime(device.lastUpdate)}` : ""} followCursor arrow>
          <div style={{ display: "flex", gap: ".8rem", alignItems: "center", justifyContent: "space-between", padding: "2px" }}>
            <DynamicIconsComponent key={device.name} category={device.category} />
            <div>
              <p>{device.model}</p>
              <p>{device.name}</p>
            </div>
          </div>
        </Tooltip>
      );
  
      el.style.backgroundColor = bgColor;
      el.style.color = color;
  
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        onClick(position.id, position.deviceId);
        setStatusCardOpen(true);
      });
  
      const marker = new mapboxgl.Marker(el)
        .setLngLat([position.longitude, position.latitude])
        .addTo(map);
  
      newMarkersMap.set(position.id, { marker, root, positionId: position.id });
    });
  
    // Atualiza `markersRef.current` com os novos marcadores
    markersRef.current = newMarkersMap;
  }, [map, positions, devices]);
  

  useEffect(()=> {
    setPositions([])
    setStops([])
  }, [selectedDeviceId]);

  return null;
};

export default MapPositions;