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
          "circle-color": `${devices[selectedId].bgColor}`, 
          "circle-radius": 22,
          "circle-opacity": 1,
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
          "text-color": `${devices[selectedId].color}`,
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

    const features = markers.map(({ latitude, longitude, stopped }) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        stopped: `${stopped}`,
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
