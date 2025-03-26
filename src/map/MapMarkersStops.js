import { useId, useEffect } from "react";
import { map } from "./core/MapView";
import { findFonts } from "./core/mapUtil";
import { useSelector } from "react-redux";

const MapMarkers = ({ markers }) => {
  const id = useId();
  const devices = useSelector((state) => state.devices.items);
  const selectedId = useSelector((state) => state.devices.selectedId);

  useEffect(() => {
    if (!map || !devices[selectedId]) return;
    if (map.getSource(id)) {
      map.removeSource(id);
    }

    if (!map.getSource(id)) {
      map.addSource(id, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      }); 
    }

    if (!map.getLayer(`${id}-circle`)) {
      map.addLayer({
        id: `${id}-circle`,
        type: "circle",
        source: id,
        paint: {
          "circle-color": ["get", "bgColor"],
          "circle-radius": 18,
          "circle-opacity": 1,
          "circle-stroke-width": 1,
          "circle-stroke-color": ["get", "subColor"],
        },
      });
    }

    if (!map.getLayer(id)) {
      map.addLayer({
        id,
        type: "symbol",
        source: id,
        layout: {
          "text-field": "{stopped}",
          "text-size": 18,
          "text-font": findFonts(map),
          "text-allow-overlap": true,
          "text-anchor": "center",
        },
        paint: { 
          "text-halo-width": 2,
          "text-color": ["get", "color"],
        },
      });
    }

    return () => {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getLayer(`${id}-circle`)) map.removeLayer(`${id}-circle`);
      if (map.getSource(id)) map.removeSource(id);
    };
  }, [map, selectedId]);

  useEffect(() => {
    if (!map || !map.getSource(id)) return;

    const features = markers.map(({ latitude, longitude, stopped, bgColor, color, subColor }) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        stopped,
        bgColor,
        color,
        subColor
      },
    }));

    map.getSource(id)?.setData({
      type: "FeatureCollection",
      features,
    });

    map.once("idle", () => {
      if (map.getLayer(id)) map.moveLayer(id);
      if (map.getLayer(`${id}-circle`)) map.moveLayer(`${id}-circle`, id);
    });
    
  }, [markers, map]);

  return null;
};

export default MapMarkers;
