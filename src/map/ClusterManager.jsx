import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import { Tooltip } from "@mui/material";
import { DynamicIconsComponent } from "../common/components/DynamicIcons.jsx";
import ColorsDevice from "../common/components/ColorsDevice.js";
import { formatTime } from "../common/util/formatter.js";

const ClusterManager = ({
  map,
  supercluster,
  positions,
  devices,
  onClick,
  setStatusCardOpen,
}) => {
  const markersRef = useRef([]);
  const clusterRef = useRef([]);

  useEffect(() => {
    if (!map || !supercluster || !Array.isArray(positions)) return;
  
    const updateMarkers = () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
  
      const clusters = supercluster.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        Math.round(zoom)
      );
  
      const visibleIds = new Set(
        clusters.filter((c) => !c.properties.cluster).map((c) => c.properties.positionId)
      );
  
      markersRef.current.forEach(({ marker, root, positionId }) => {
        if (!visibleIds.has(positionId)) {
          setTimeout(() => {
            root?.unmount?.();
          }, 0);
          marker.remove();
        }
      });
  
      markersRef.current = markersRef.current.filter(({ positionId }) =>
        visibleIds.has(positionId)
      );
  
      clusterRef.current.forEach(({ marker }) => {
        marker.remove();
      });
      clusterRef.current = [];
  
      clusters.forEach((feature) => {
        const [longitude, latitude] = feature.geometry.coordinates;

        if (feature.properties.cluster) {
          const el = document.createElement("div");
          el.className = "cluster-marker";
          el.innerText = feature.properties.point_count;

          const marker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map);

          el.addEventListener("click", () => {
            const expansionZoom = Math.min(
              supercluster.getClusterExpansionZoom(feature.id),
              20
            );
            map.easeTo({ center: [longitude, latitude], zoom: expansionZoom });
          });

          clusterRef.current.push({ marker });
        } else {
          const position = positions?.find?.((p) => p?.id === feature.properties.positionId);
          if (!position) return;
          const device = devices[feature.properties.deviceId];
          const attributes = device?.attributes || {};
          const { bgColor, color } = ColorsDevice(attributes["web.reportColor"]);

          const el = document.createElement("div");
          el.className = "marker";
          el.style.backgroundColor = bgColor;
          el.style.color = color;

          const root = createRoot(el);
          root.render(
            <Tooltip
              title={
                device ? `Última atualização: ${formatTime(device.lastUpdate)}` : ""
              }
              followCursor
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: { offset: [0, 24] },
                    },
                  ],
                },
              }}
            >
              <div
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
                />
                <div className="marker-text">
                  <p>{device?.model}</p>
                  <p>{device?.name}</p>
                </div>
              </div>
            </Tooltip>
          );

          el.addEventListener("click", (event) => {
            event.stopPropagation();
            onClick(position.id, position.deviceId);
            setStatusCardOpen(true);
          });

          const marker = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(map);

          markersRef.current.push({ marker, root, positionId: position.id });
        }
      });
    };

    updateMarkers();
    map.on("moveend", updateMarkers);

    return () => {
      map.off("moveend", updateMarkers);
    };
  }, [supercluster, map, devices]);

  return null;
};

export default ClusterManager;
