import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { map } from "./core/MapView.jsx";
import mapboxgl from "mapbox-gl";
import "./css/style.css";
import { DynamicIconsComponent } from "../common/components/DynamicIcons.jsx";
import { Tooltip } from "@mui/material";
import { createRoot } from "react-dom/client";
import ColorsDevice from "../common/components/ColorsDevice.js";
import { formatTime } from "../common/util/formatter.js";

const MapPositions = ({
  positions,
  onClick,
  setStatusCardOpen,
  setPositions,
  setStops,
  MainMap,
}) => {
  const markersRef = useRef([]);
  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const devicesPropsKey = positions
  .map((p) => {
    const d = devices[p.deviceId] || {};
    return [d.category, d.name, d.model, d.attributes?.["web.reportColor"]].join("-");
  })
  .join("|");

  useEffect(() => {
    if (!map || !positions.length) return;

    const clearMarkers = () => {
      markersRef.current.forEach(({ marker, root }) => {
        setTimeout(() => {
          root.unmount();
          marker.remove();
        }, 0);
      });
      markersRef.current = [];
    };

    return () => {
      clearMarkers();
    };
  }, [map, devicesPropsKey]);

  useEffect(() => {
    if (!map || !positions.length) return;

    const newPositionMap = new Map(positions.map((p) => [p.id, p]));

    markersRef.current = markersRef.current.filter(
      ({ marker, root, positionId }) => {
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
          if (
            currentLngLat.lng !== longitude ||
            currentLngLat.lat !== latitude
          ) {
            marker.setLngLat([longitude, latitude]);
          }
          return true;
        }
      }
    );

    positions.forEach((position) => {
      if (markersRef.current.some((m) => m.positionId === position.id)) return;

      const el = document.createElement("div");
      const device = devices[position.deviceId];
      const attributes = device.attributes || {};
      const { bgColor, color } = ColorsDevice(attributes["web.reportColor"]);

      el.className = "marker";

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
                  name: 'offset',
                  options: {
                    offset: [0, 24],
                  },
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
              maxWidth: '100%',
            }}
          >
            <DynamicIconsComponent
              key={device.name}
              category={device.category}
            />
            <div className="marker-text">
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

      markersRef.current.push({ marker, root, positionId: position.id });
    });
  }, [map, positions, devices]);

  useEffect(() => {
    if(MainMap) {
      setPositions([]);
      setStops([]);
    }
  }, [selectedDeviceId, MainMap]);

  return null;
};

export default MapPositions;
