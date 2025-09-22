import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { map } from "./core/MapView.jsx";
import mapboxgl from "mapbox-gl";
import "./css/mapPositions.css";
import { DynamicIconsComponent } from "../common/components/DynamicIcons.jsx";
import { Tooltip } from "@mui/material";
import { createRoot } from "react-dom/client";
import Supercluster from "supercluster";
import {
  formatSpeedNoTranslation,
  formatTime,
} from "../common/util/formatter.js";
import { getRandomColor } from "../common/util/colors.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import centerInMap from "../common/util/centerInMap.js";

const MapPositions = ({
  positions,
  onClick,
  setStatusCardOpen,
  setPositions,
  setStops,
  MainMap,
}) => {
  const markersRef = useRef(new Map());
  const clusterIndex = useRef(null);

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const devicesPropsKey = positions
    .map((p) => {
      const d = devices[p.deviceId] || {};
      const colors = d.attributes?.deviceColors || {};
      return JSON.stringify([d.category, d.name, d.model, colors]);
    })
    .join("|");

  const clearAllMarkers = () => {
    markersRef.current.forEach(({ marker, root }) => {
      try {
        setTimeout(() => {
          root.unmount();
        }, 0);
      } catch (e) {}
      try {
        marker.remove();
      } catch (e) {}
    });
    markersRef.current.clear();
  };

  useEffect(() => {
    if (!map) return;
    if (!positions || positions.length === 0) {
      clearAllMarkers();
      clusterIndex.current = null;
      return;
    }

    const features = positions.map((p) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.longitude, p.latitude],
      },
      properties: {
        positionId: p.id,
        deviceId: p.deviceId,
        speed: p.speed,
        attrs: p.attributes || {},
      },
    }));

    clusterIndex.current = new Supercluster({
      radius: 60,
      maxZoom: 18,
    }).load(features);

    renderClusters();
  }, [positions, devicesPropsKey, map]);

  useEffect(() => {
    if (!map) return;
    const onMoveEnd = () => renderClusters();
    const onZoomEnd = () => renderClusters();
    map.on("moveend", onMoveEnd);
    map.on("zoomend", onZoomEnd);

    return () => {
      map.off("moveend", onMoveEnd);
      map.off("zoomend", onZoomEnd);
    };
  }, [map, clusterIndex.current]);

  const renderClusters = () => {
    if (!map || !clusterIndex.current) return;

    const b = map.getBounds().toArray();
    const bbox = [b[0][0], b[0][1], b[1][0], b[1][1]];
    const zoom = Math.floor(map.getZoom());

    const clusters = clusterIndex.current.getClusters(bbox, zoom);

    const newKeys = new Set();

    clusters.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      if (props.cluster) {
        const clusterId = props.cluster_id;
        const count = props.point_count || 0;
        const key = `c_${clusterId}`;
        newKeys.add(key);

        const existing = markersRef.current.get(key);
        if (existing) {
          const cur = existing.marker.getLngLat();
          if (cur.lng !== lng || cur.lat !== lat) {
            existing.marker.setLngLat([lng, lat]);
          }
        } else {
          const el = document.createElement("div");
          const size = Math.min(
            70,
            30 + Math.round(Math.log10(count || 1) * 18)
          );
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.borderRadius = "50%";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.cursor = "pointer";
          el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
          el.style.background = "rgba(0,120,255,0.85)";
          el.style.color = "#fff";
          el.style.fontWeight = "700";
          el.className = "cluster-marker";

          const root = createRoot(el);
          root.render(
            <Tooltip
              title={`${count} dispositivos`}
              followCursor
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 28],
                      },
                    },
                  ],
                },
                tooltip: {
                  sx: {
                    maxWidth: 500,
                    whiteSpace: "pre-line",
                    fontSize: ".75rem",
                  },
                },
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span>{count}</span>
              </div>
            </Tooltip>
          );

          const onClick = (e) => {
            e.stopPropagation();
            try {
              const expansionZoom =
                clusterIndex.current.getClusterExpansionZoom(clusterId);
              map.easeTo({
                center: [lng, lat],
                zoom: expansionZoom,
              });
            } catch (err) {
              map.easeTo({
                center: [lng, lat],
                zoom: Math.min(20, map.getZoom() + 2),
              });
            }
          };
          el.addEventListener("click", onClick);

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map);

          markersRef.current.set(key, {
            marker,
            root,
            type: "cluster",
            id: clusterId,
            el,
            onClick,
          });
        }
      } else {
        const positionId = props.positionId;
        const deviceId = props.deviceId;
        const key = `p_${positionId}`;
        newKeys.add(key);

        const existing = markersRef.current.get(key);
        if (existing) {
          const cur = existing.marker.getLngLat();
          if (cur.lng !== lng || cur.lat !== lat) {
            existing.marker.setLngLat([lng, lat]);
          }
        } else {
          const el = document.createElement("div");
          el.className = "marker";

          const device = devices[deviceId];
          const ignition = props.attrs?.ignition || props.attrs?.motion;
          const speed = props.speed;
          const deviceColors =
            device?.attributes?.deviceColors || getRandomColor();
          const { background, text, icon } = deviceColors;

          el.style.backgroundColor = background || "transparent";
          el.style.color = text || "#000";


          const root = createRoot(el);
          root.render(
            <Tooltip
              title={
                device
                  ? `${device.name} - ${formatTime(device.lastUpdate)} - ${
                      ignition ? "Ligado" : "Desligado"
                    } ${
                      speed ? `(${formatSpeedNoTranslation(speed, "kmh")})` : ""
                    }`
                  : ""
              }
              followCursor
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 28],
                      },
                    },
                  ],
                },
                tooltip: {
                  sx: {
                    maxWidth: 500,
                    whiteSpace: "pre-line",
                    fontSize: ".75rem",
                  },
                },
              }}
            >
              <div
                onClick={()=> centerInMap({lng, lat})}
                style={{
                  display: "flex",
                  gap: ".4rem",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1px",
                  maxWidth: "100%",
                }}
              >
                <DynamicIconsComponent
                  key={device?.name}
                  category={device?.category}
                  color={icon}
                />
                <div className="marker-text">
                  <p>{device?.model}</p>
                  <p>{device?.name}</p>
                </div>
                {ignition ? (
                  <span className="ignitionIcon">
                    <FontAwesomeIcon icon={faPowerOff} size="lg" />
                  </span>
                ) : (
                  ""
                )}
              </div>
            </Tooltip>
          );

          el.addEventListener("click", (event) => {
            event.stopPropagation();
            onClick(positionId, deviceId);
            setStatusCardOpen(true);
          });

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map);

          markersRef.current.set(key, {
            marker,
            root,
            type: "point",
            id: positionId,
            el,
          });
        }
      }
    });

    markersRef.current.forEach((value, key) => {
      if (!newKeys.has(key)) {
        try {
          setTimeout(() => value.root.unmount(), 0);
        } catch (e) {}
        try {
          value.marker.remove();
        } catch (e) {}
        if (value.type === "cluster" && value.el && value.onClick) {
          try {
            value.el.removeEventListener("click", value.onClick);
          } catch (e) {}
        }
        markersRef.current.delete(key);
      }
    });
  };

  useEffect(() => {
    return () => {
      clearAllMarkers();
      clusterIndex.current = null;
    };
  }, []);

  useEffect(() => {
    if (MainMap) {
      setPositions([]);
      setStops([]);
    }
  }, [selectedDeviceId, MainMap]);

  return null;
};

export default MapPositions;
