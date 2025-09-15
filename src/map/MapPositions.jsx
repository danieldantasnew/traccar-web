import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { map } from "./core/MapView.jsx";
import mapboxgl from "mapbox-gl";
import "./css/mapPositions.css";
import { DynamicIconsComponent } from "../common/components/DynamicIcons.jsx";
import { Tooltip } from "@mui/material";
import { createRoot } from "react-dom/client";
import {
  formatSpeedNoTranslation,
  formatTime,
} from "../common/util/formatter.js";
import { getRandomColor } from "../common/util/colors.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

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
      const colors = d.attributes?.deviceColors || {};
      return JSON.stringify([d.category, d.name, d.model, colors]);
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
      const ignition =
        position?.attributes?.ignition || position?.attributes?.motion;
      const speed = position?.speed;
      const deviceColors = device?.attributes?.deviceColors || getRandomColor();
      const { background, text, icon } = deviceColors;

      el.className = "marker";

      const root = createRoot(el);
      root.render(
        <Tooltip
          title={
            device
              ? `${device.name} - ${formatTime(device.lastUpdate)} - ${
                  ignition ? "Ligado" : "Desligado"
                } ${speed ? `(${formatSpeedNoTranslation(speed, "kmh")})` : ""}`
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
                    offset: [0, 24],
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
          {ignition ? <span className="ignitionIcon"><FontAwesomeIcon icon={faPowerOff} size="lg"/></span> : ''}
          </div>
        </Tooltip>
      );

      el.style.backgroundColor = background;
      el.style.color = text;

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
    if (MainMap) {
      setPositions([]);
      setStops([]);
    }
  }, [selectedDeviceId, MainMap]);

  return null;
};

export default MapPositions;


