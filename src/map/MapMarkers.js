import { useId, useEffect } from "react";
import { map } from "./core/MapView";
import { findFonts } from "./core/mapUtil";

const MapMarkers = ({ markers }) => {
  const id = useId();

  useEffect(() => {
    if (!map) return;
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
          "circle-color": "#FFC200", 
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
          "text-color": "rgb(0, 45, 143)",
        },
      });
    }

    return () => {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getLayer(`${id}-circle`)) map.removeLayer(`${id}-circle`);
      if (map.getSource(id)) map.removeSource(id);
    };
  }, [map]);

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
